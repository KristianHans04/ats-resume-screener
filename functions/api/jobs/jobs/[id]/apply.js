import { jsonResponse, errorResponse } from '../../../../lib/response.js';
import { analyzeResume } from '../../../../lib/ai.js';

const RESUME_READ_FAILURE_MESSAGE = 'We could not read enough text from the uploaded resume. Please upload a clearer PDF or DOCX resume and try again.';
const REVIEW_UNAVAILABLE_MESSAGE = 'We could not complete the application review right now. Please try again in a few minutes.';

// POST /api/jobs/jobs/:id/apply – apply for a job (candidates only)
export async function onRequestPost(context) {
  const { request, env, params, data } = context;
  const jobId = params.id;
  const user = data.user;

  if (user.role !== 'CANDIDATE') {
    return errorResponse('Only candidates can apply to jobs', 403);
  }

  const job = await env.CSAS_DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(jobId).first();
  if (!job) return errorResponse('Job not found', 404);

  // Check not already applied (allow retry for REJECTED_NOT_CV or FAILED)
  const existing = await env.CSAS_DB.prepare(
    'SELECT id, status, classification FROM applications WHERE job_id = ? AND candidate_id = ?'
  ).bind(jobId, parseInt(user.id)).first();

  if (existing) {
    const retryable = existing.classification === 'REJECTED_NOT_CV' || existing.status === 'FAILED';
    if (!retryable) {
      return errorResponse('You have already applied for this job');
    }
    // Delete the old failed/rejected-not-cv application so they can retry
    await env.CSAS_DB.prepare('DELETE FROM applications WHERE id = ?').bind(existing.id).run();
  }

  // Parse multipart form data
  const formData = await request.formData();
  const resumeFile = formData.get('resume');
  const fullName = formData.get('full_name') || '';
  const email = formData.get('email') || '';
  const phone = formData.get('phone') || '';

  if (!resumeFile) {
    return errorResponse('No resume file provided');
  }

  if (!fullName.trim()) {
    return errorResponse('Full name is required');
  }

  // Store resume in R2
  const resumeKey = `resumes/${user.id}/${Date.now()}_${resumeFile.name}`;
  const resumeBuffer = await resumeFile.arrayBuffer();
  await env.CSAS_STORAGE.put(resumeKey, resumeBuffer, {
    httpMetadata: { contentType: resumeFile.type || 'application/pdf' },
  });

  // Create application in PARSING state
  const result = await env.CSAS_DB.prepare(`
    INSERT INTO applications (job_id, candidate_id, full_name, email, phone, resume_key, status)
    VALUES (?, ?, ?, ?, ?, ?, 'PARSING')
  `).bind(jobId, parseInt(user.id), fullName.trim(), email.trim(), phone.trim(), resumeKey).run();

  const appId = result.meta.last_row_id;
  console.log(`[APPLY] appId=${appId} | file="${resumeFile.name}" | type="${resumeFile.type}" | size=${resumeBuffer.byteLength}B | job=${jobId}`);

  let resumeText = '';
  try {
    resumeText = await extractResumeText(resumeBuffer, resumeFile.type, env);
    console.log(`[APPLY] extraction done | chars=${resumeText.trim().length} | readable=${isReadableText(resumeText)} | appId=${appId}`);
  } catch (err) {
    console.error(`[APPLY] extraction threw for appId=${appId}:`, err.message, err.stack);
    // Don't fail the application — fall through with empty text, handled below
  }

  // If extraction returned garbage or too little, try vision one last time as emergency fallback
  if (!isReadableText(resumeText) || resumeText.trim().length < 80) {
    console.warn(`[APPLY] low-quality text (${resumeText?.trim().length ?? 0} chars) — attempting emergency vision OCR`);
    try {
      const visionFallback = await extractTextViaVision(resumeBuffer, resumeFile.type || 'application/pdf', env);
      if (isReadableText(visionFallback) && visionFallback.trim().length > 80) {
        resumeText = visionFallback;
        console.log(`[APPLY] emergency vision succeeded: ${resumeText.trim().length} chars`);
      }
    } catch (e) {
      console.error('[APPLY] emergency vision threw:', e.message);
    }
  }

  // If we still can't read it, do NOT reject the applicant — proceed with generic inquiry questions
  const extractionFailed = !isReadableText(resumeText) || resumeText.trim().length < 80;
  if (extractionFailed) {
    console.warn(`[APPLY] extraction completely failed — skipping AI analysis, using fallback questions for appId=${appId}`);
    const fallbackQuestions = [
      { id: 'q1', role: 'system', gap: 'experience', text: 'Please walk us through your most relevant work experience or projects that qualify you for this role.' },
      { id: 'q2', role: 'system', gap: 'skills', text: 'What specific technical skills, tools, or frameworks do you have that are directly relevant to this position?' },
      { id: 'q3', role: 'system', gap: 'motivation', text: 'Why are you interested in this particular role and what unique value would you bring to the team?' },
    ];
    await env.CSAS_DB.prepare(`
      UPDATE applications
      SET status = 'AWAITING_INQUIRY', classification = 'UNDEREXPLAINED', ai_score = 50, resume_score = 50,
          semantic_gaps = '[]', generated_questions = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(JSON.stringify(fallbackQuestions), appId).run();
    const app = await env.CSAS_DB.prepare('SELECT * FROM applications WHERE id = ?').bind(appId).first();
    return jsonResponse(formatApplication(app, user.username, job.title, job.company), 201);
  }

  await env.CSAS_DB.prepare(
    'UPDATE applications SET resume_text = ? WHERE id = ?'
  ).bind(resumeText, appId).run();

  const jobDesc = [
    job.title,
    job.description,
    job.requirements ? `Requirements: ${job.requirements}` : '',
    job.responsibilities ? `Responsibilities: ${job.responsibilities}` : '',
  ].filter(Boolean).join('\n\n');

  try {
    console.log(`[APPLY] calling AI analyzeResume | textLen=${resumeText.length} | appId=${appId}`);
    const aiResult = await analyzeResume(env, jobDesc, resumeText);
    const { classification, score, rejection_reason, semantic_gaps, generated_questions } = aiResult;
    console.log(`[APPLY] AI result | classification=${classification} | score=${score} | questions=${generated_questions.length} | appId=${appId}`);

    let newStatus;
    if (classification === 'REJECTED_WRONG_ROLE' || classification === 'REJECTED_NOT_CV') {
      newStatus = 'REJECTED';
    } else if (generated_questions.length > 0) {
      newStatus = 'AWAITING_INQUIRY';
    } else {
      newStatus = 'COMPLETED';
    }

    await env.CSAS_DB.prepare(`
      UPDATE applications
      SET status = ?, classification = ?, ai_score = ?, resume_score = ?,
          rejection_reason = ?, semantic_gaps = ?, generated_questions = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      newStatus,
      classification,
      score,
      score,
      rejection_reason,
      JSON.stringify(semantic_gaps),
      JSON.stringify(generated_questions),
      appId
    ).run();

    const app = await env.CSAS_DB.prepare('SELECT * FROM applications WHERE id = ?').bind(appId).first();
    return jsonResponse(formatApplication(app, user.username, job.title, job.company), 201);
  } catch (err) {
    console.error(`[APPLY] AI analysis threw for appId=${appId}:`, err.message, err.stack);
    await cleanupTransientApplication(env, appId, resumeKey);
    return errorResponse(REVIEW_UNAVAILABLE_MESSAGE, 503);
  }
}

function formatApplication(app, candidateUsername, jobTitle, companyName) {
  return {
    id: app.id,
    job: app.job_id,
    job_title: jobTitle,
    company_name: companyName,
    candidate: candidateUsername,
    candidate_username: candidateUsername,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    resume: app.resume_key,
    status: app.status,
    classification: app.classification,
    rejection_reason: app.rejection_reason,
    ai_score: app.ai_score,
    resume_score: app.resume_score,
    final_score: app.ai_score,
    semantic_gaps: safeJsonParse(app.semantic_gaps, []),
    generated_questions: safeJsonParse(app.generated_questions, []),
    answers: safeJsonParse(app.answers, []),
    created_at: app.created_at,
    updated_at: app.updated_at,
  };
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

async function markApplicationFailed(env, appId, reason) {
  await env.CSAS_DB.prepare(`
    UPDATE applications
    SET status = 'FAILED', rejection_reason = ?, updated_at = datetime('now')
    WHERE id = ?
  `).bind(reason, appId).run();

  return env.CSAS_DB.prepare('SELECT * FROM applications WHERE id = ?').bind(appId).first();
}

async function cleanupTransientApplication(env, appId, resumeKey) {
  try {
    await env.CSAS_DB.prepare('DELETE FROM applications WHERE id = ?').bind(appId).run();
  } catch (err) {
    console.error('Failed to clean up transient application record:', err);
  }

  try {
    await env.CSAS_STORAGE.delete(resumeKey);
  } catch (err) {
    console.error('Failed to clean up transient resume object:', err);
  }
}

// Returns true if the text looks like real human-readable content
// (at least 35% alphabetic characters, rules out binary garbage)
function isReadableText(text) {
  if (!text || text.trim().length < 20) return false;
  const alpha = (text.match(/[a-zA-Z]/g) || []).length;
  return alpha / text.length >= 0.35;
}

async function extractResumeText(buffer, mimeType, env) {
  const type = (mimeType || '').toLowerCase();
  console.log(`[EXTRACT] mimeType="${mimeType}" | size=${buffer.byteLength}B`);

  if (type === 'application/pdf') {
    console.log('[EXTRACT] path=PDF text extraction');
    const text = await extractTextFromPDF(buffer);
    const readable = isReadableText(text);
    console.log(`[EXTRACT] PDF raw chars=${text.trim().length} | readable=${readable}`);

    // If extraction returned garbage binary content OR very little text, always try vision
    if (!readable || text.trim().length < 150) {
      console.log('[EXTRACT] PDF not readable or too short — trying vision OCR');
      const visionText = await extractTextViaVision(buffer, 'application/pdf', env);
      if (isReadableText(visionText) && visionText.trim().length > text.trim().length) {
        console.log(`[EXTRACT] vision returned ${visionText.trim().length} readable chars`);
        return visionText;
      }
    }

    return text;
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    console.log('[EXTRACT] path=DOCX XML parse');
    try {
      const text = await extractTextFromDocx(buffer);
      console.log(`[EXTRACT] DOCX chars=${text.trim().length}`);
      if (text.trim().length > 50) return text;
      console.log('[EXTRACT] DOCX too short, falling back to vision');
    } catch (e) {
      console.error('[EXTRACT] DOCX parse threw:', e.message);
    }
    return await extractTextViaVision(buffer, type, env);
  }

  if (type === 'application/msword') {
    console.log('[EXTRACT] path=legacy DOC → vision');
    return await extractTextViaVision(buffer, 'application/pdf', env);
  }

  if (type.startsWith('image/')) {
    console.log(`[EXTRACT] path=image → vision (${type})`);
    return await extractTextViaVision(buffer, mimeType, env);
  }

  console.log('[EXTRACT] path=fallback PDF extraction');
  return await extractTextFromPDF(buffer);
}

async function extractTextFromDocx(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const target = 'word/document.xml';
  const targetBytes = new TextEncoder().encode(target);

  let offset = 0;
  while (offset < bytes.length - 30) {
    if (bytes[offset] === 0x50 && bytes[offset + 1] === 0x4B &&
        bytes[offset + 2] === 0x03 && bytes[offset + 3] === 0x04) {
      const compressionMethod = view.getUint16(offset + 8, true);
      const compressedSize = view.getUint32(offset + 18, true);
      const filenameLen = view.getUint16(offset + 26, true);
      const extraLen = view.getUint16(offset + 28, true);
      const filenameStart = offset + 30;
      const filename = new TextDecoder().decode(bytes.slice(filenameStart, filenameStart + filenameLen));
      const dataStart = filenameStart + filenameLen + extraLen;

      if (filename === target) {
        const compressedData = bytes.slice(dataStart, dataStart + compressedSize);
        let xmlText = '';

        if (compressionMethod === 0) {
          xmlText = new TextDecoder().decode(compressedData);
        } else if (compressionMethod === 8) {
          const ds = new DecompressionStream('deflate-raw');
          const writer = ds.writable.getWriter();
          const reader = ds.readable.getReader();
          writer.write(compressedData);
          writer.close();
          const chunks = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
          }
          const total = chunks.reduce((sum, c) => sum + c.length, 0);
          const combined = new Uint8Array(total);
          let pos = 0;
          for (const c of chunks) { combined.set(c, pos); pos += c.length; }
          xmlText = new TextDecoder().decode(combined);
        }

        if (xmlText) {
          const parts = [];
          const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
          let m;
          while ((m = regex.exec(xmlText)) !== null) {
            if (m[1].trim()) parts.push(m[1]);
          }
          return parts.join(' ').replace(/\s+/g, ' ').trim();
        }
      }

      offset = dataStart + compressedSize;
    } else {
      offset++;
    }
  }
  return '';
}

async function extractTextViaVision(buffer, mimeType, env) {
  const apiKey = env.GOOGLE_AI_API_KEY || env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('[VISION] GOOGLE_AI_API_KEY not set, skipping vision extraction');
    return '';
  }

  const arr = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]);
  const base64 = btoa(binary);

  const supportedMime = mimeType.startsWith('image/') ? mimeType : 'application/pdf';
  const visionAttempts = [
    { model: 'gemini-2.5-flash', version: 'v1' },
    { model: 'gemini-2.5-pro', version: 'v1' },
    { model: 'gemini-2.0-flash', version: 'v1' },
  ];
  console.log(`[VISION] attempting extraction | mime=${supportedMime} | size=${buffer.byteLength}B`);

  for (const { model, version } of visionAttempts) {
    try {
      console.log(`[VISION] trying ${version}/${model}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                { inline_data: { mime_type: supportedMime, data: base64 } },
                { text: 'Extract all text from this CV/resume document. Return only the raw text content, preserving all sections: contact info, work experience, education, skills, projects.' },
              ],
            }],
            generationConfig: { maxOutputTokens: 4096 },
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`[VISION] ${version}/${model} returned ${text.trim().length} chars`);
        if (text.trim().length > 10) return text.trim().slice(0, 8000);
      } else {
        const errBody = await response.text();
        console.error(`[VISION] ${version}/${model} HTTP ${response.status}: ${errBody}`);
      }
    } catch (e) {
      console.error(`[VISION] ${version}/${model} threw:`, e.message);
    }
  }
  console.warn('[VISION] all models failed, returning empty string');
  return '';
}

function extractTextFromPDF(arrayBuffer) {
  // Simple PDF text extraction for edge runtime
  // Decodes the raw bytes and extracts text between BT/ET operators
  // Falls back to basic string extraction if structured parsing fails
  const bytes = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

  // Try to extract text from PDF text objects
  const extracted = [];
  const regex = /\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const segment = match[1]
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\\/g, '\\');
    if (segment.length > 2 && /[a-zA-Z]/.test(segment)) {
      extracted.push(segment);
    }
  }

  if (extracted.length > 5) {
    return extracted.join(' ').replace(/\s+/g, ' ').trim().slice(0, 8000);
  }

  // Fallback: extract all printable strings
  const printable = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Remove PDF structure noise
  return printable
    .replace(/(%PDF|endobj|endstream|xref|trailer|startxref|\/\w+)/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000);
}
