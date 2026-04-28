import { jsonResponse, errorResponse } from '../../../../lib/response.js';

// GET /api/jobs/jobs/:id/applications – list applications for a job (recruiter only)
export async function onRequestGet(context) {
  const { env, params, data } = context;
  const jobId = params.id;
  const user = data.user;

  if (user.role !== 'RECRUITER') {
    return errorResponse('Only recruiters can view job applications', 403);
  }

  const job = await env.CSAS_DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(jobId).first();
  if (!job) return errorResponse('Job not found', 404);
  if (job.recruiter_id !== parseInt(user.id)) {
    return errorResponse('You can only view applications for jobs you created', 403);
  }

  const apps = await env.CSAS_DB.prepare(`
    SELECT a.*, u.username as candidate_username
    FROM applications a
    JOIN users u ON a.candidate_id = u.id
    WHERE a.job_id = ?
    ORDER BY a.ai_score DESC, a.created_at DESC
  `).bind(jobId).all();

  const results = apps.results.map(app => ({
    id: app.id,
    job: app.job_id,
    job_title: job.title,
    company_name: job.company,
    candidate: app.candidate_username,
    candidate_username: app.candidate_username,
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
  }));

  return jsonResponse(results);
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}
