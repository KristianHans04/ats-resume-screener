import { jsonResponse, errorResponse } from '../../../../lib/response.js';
import { evaluateAnswers } from '../../../../lib/ai.js';

// POST /api/jobs/applications/:id/answer – submit inquiry answers
export async function onRequestPost(context) {
  const { request, env, params, data } = context;
  const appId = params.id;
  const user = data.user;

  if (user.role !== 'CANDIDATE') {
    return errorResponse('Only candidates can submit answers', 403);
  }

  const app = await env.CSAS_DB.prepare(`
    SELECT a.*, j.description as job_description, j.requirements as job_requirements
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ? AND a.candidate_id = ?
  `).bind(appId, parseInt(user.id)).first();

  if (!app) return errorResponse('Application not found', 404);

  if (app.status !== 'AWAITING_INQUIRY') {
    return errorResponse('This application is not awaiting inquiry answers');
  }

  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON'); }

  const { answers } = body;
  if (!answers || !Array.isArray(answers)) {
    return errorResponse('No answers provided');
  }

  // Normalize answers to standard format: { question_id, answer }
  const normalizedAnswers = answers.map(a => ({
    question_id: a.question_id || a.id,
    answer: a.answer || a.text || '',
  }));

  // Validate answer count matches questions
  const questions = safeJsonParse(app.generated_questions, []);
  if (normalizedAnswers.length !== questions.length) {
    return errorResponse(`Expected ${questions.length} answers, got ${normalizedAnswers.length}`);
  }

  // Save answers and set to EVALUATING
  await env.CSAS_DB.prepare(`
    UPDATE applications SET answers = ?, status = 'EVALUATING', updated_at = datetime('now') WHERE id = ?
  `).bind(JSON.stringify(normalizedAnswers), appId).run();

  // Run AI evaluation
  try {
    const jobDesc = [app.job_description, app.job_requirements].filter(Boolean).join('\n\n');

    const result = await evaluateAnswers(env, jobDesc, questions, normalizedAnswers, app.ai_score || 0);

    const adjustedScore = result.adjusted_score || app.ai_score || 0;

    await env.CSAS_DB.prepare(`
      UPDATE applications SET ai_score = ?, status = 'COMPLETED', updated_at = datetime('now') WHERE id = ?
    `).bind(adjustedScore, appId).run();

    return jsonResponse({ status: 'Answers submitted and evaluation completed.' });
  } catch (err) {
    console.error('Answer evaluation failed:', err);

    // Still mark as completed with original score
    await env.CSAS_DB.prepare(`
      UPDATE applications SET status = 'COMPLETED', updated_at = datetime('now') WHERE id = ?
    `).bind(appId).run();

    return jsonResponse({ status: 'Answers submitted. Evaluation completed with original score.' });
  }
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}
