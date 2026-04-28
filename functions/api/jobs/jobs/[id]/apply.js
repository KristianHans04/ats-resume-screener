import { jsonResponse, errorResponse } from '../../../../lib/response.js';
import { analyzeResume } from '../../../../lib/ai.js';

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

  try {
    const resumeText = await extractTextFromPDF(resumeBuffer);

    await env.CSAS_DB.prepare(
      'UPDATE applications SET resume_text = ? WHERE id = ?'
    ).bind(resumeText, appId).run();

    // Build the full job description for AI
    const jobDesc = [
      job.title,
      job.description,
      job.requirements ? `Requirements: ${job.requirements}` : '',
      job.responsibilities ? `Responsibilities: ${job.responsibilities}` : '',
    ].filter(Boolean).join('\n\n');

    // Call AI to analyze
    const aiResult = await analyzeResume(env, jobDesc, resumeText);

    const { classification, score, rejection_reason, semantic_gaps, generated_questions } = aiResult;

    // Determine status based on classification
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
    console.error('AI analysis failed:', err);

    await env.CSAS_DB.prepare(
      "UPDATE applications SET status = 'FAILED', updated_at = datetime('now') WHERE id = ?"
    ).bind(appId).run();

    const app = await env.CSAS_DB.prepare('SELECT * FROM applications WHERE id = ?').bind(appId).first();
    return jsonResponse(formatApplication(app, user.username, job.title, job.company), 201);
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

async function extractTextFromPDF(arrayBuffer) {
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
    return extracted.join(' ');
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
