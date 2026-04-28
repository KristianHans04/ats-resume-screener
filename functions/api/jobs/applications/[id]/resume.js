import { errorResponse } from '../../../../lib/response.js';

// GET /api/jobs/applications/:id/resume – download resume PDF from R2
export async function onRequestGet(context) {
  const { env, params, data } = context;
  const appId = params.id;
  const user = data.user;

  const app = await env.CSAS_DB.prepare(`
    SELECT a.resume_key, a.candidate_id, j.recruiter_id
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ?
  `).bind(appId).first();

  if (!app) return errorResponse('Application not found', 404);

  // Candidates can download their own; recruiters can download for their jobs
  if (user.role === 'CANDIDATE' && app.candidate_id !== parseInt(user.id)) {
    return errorResponse('Not authorized', 403);
  }
  if (user.role === 'RECRUITER' && app.recruiter_id !== parseInt(user.id)) {
    return errorResponse('Not authorized', 403);
  }

  if (!app.resume_key) {
    return errorResponse('No resume file found', 404);
  }

  const object = await env.CSAS_STORAGE.get(app.resume_key);
  if (!object) {
    return errorResponse('Resume file not found in storage', 404);
  }

  const headers = new Headers();
  headers.set('Content-Type', object.httpMetadata?.contentType || 'application/pdf');
  headers.set('Content-Disposition', `inline; filename="resume.pdf"`);

  return new Response(object.body, { headers });
}
