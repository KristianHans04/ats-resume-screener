import { jsonResponse, errorResponse } from '../../../lib/response.js';

// GET /api/jobs/applications – list current user's applications
export async function onRequestGet(context) {
  const { env, data } = context;
  const user = data.user;

  let apps;
  if (user.role === 'CANDIDATE') {
    apps = await env.CSAS_DB.prepare(`
      SELECT a.*, j.title as job_title, j.company as company_name, u.username as candidate_username
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.candidate_id = u.id
      WHERE a.candidate_id = ?
      ORDER BY a.created_at DESC
    `).bind(parseInt(user.id)).all();
  } else {
    apps = await env.CSAS_DB.prepare(`
      SELECT a.*, j.title as job_title, j.company as company_name, u.username as candidate_username
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.candidate_id = u.id
      WHERE j.recruiter_id = ?
      ORDER BY a.ai_score DESC, a.created_at DESC
    `).bind(parseInt(user.id)).all();
  }

  const isCandidate = user.role === 'CANDIDATE';

  const results = apps.results.map(app => ({
    id: app.id,
    job: app.job_id,
    job_title: app.job_title,
    company_name: app.company_name,
    candidate: app.candidate_username,
    candidate_username: app.candidate_username,
    full_name: app.full_name,
    email: app.email,
    phone: app.phone,
    resume: app.resume_key,
    status: app.status,
    classification: app.classification,
    rejection_reason: app.rejection_reason,
    // Hide scores from candidates
    ai_score: isCandidate ? undefined : app.ai_score,
    resume_score: isCandidate ? undefined : app.resume_score,
    final_score: isCandidate ? undefined : app.ai_score,
    semantic_gaps: safeJsonParse(app.semantic_gaps, []),
    generated_questions: safeJsonParse(app.generated_questions, []),
    answers: safeJsonParse(app.answers, []),
    created_at: app.created_at,
    updated_at: app.updated_at,
  }));

  return jsonResponse(results);
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}
