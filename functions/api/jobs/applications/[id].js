import { jsonResponse, errorResponse } from '../../../lib/response.js';

// GET /api/jobs/applications/:id – get application details
export async function onRequestGet(context) {
  const { env, params, data } = context;
  const appId = params.id;
  const user = data.user;

  const app = await env.CSAS_DB.prepare(`
    SELECT a.*, j.title as job_title, j.company as company_name,
           j.description as job_description, j.recruiter_id as job_recruiter_id,
           u.username as candidate_username
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    JOIN users u ON a.candidate_id = u.id
    WHERE a.id = ?
  `).bind(appId).first();

  if (!app) return errorResponse('Application not found', 404);

  // Authorization: candidates can only see their own, recruiters only their job's applications
  if (user.role === 'CANDIDATE' && app.candidate_id !== parseInt(user.id)) {
    return errorResponse('Not authorized', 403);
  }
  if (user.role === 'RECRUITER' && app.job_recruiter_id !== parseInt(user.id)) {
    return errorResponse('Not authorized', 403);
  }

  const isCandidate = user.role === 'CANDIDATE';

  return jsonResponse({
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
  });
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}
