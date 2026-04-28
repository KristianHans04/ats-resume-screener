import { jsonResponse, errorResponse } from '../../../../lib/response.js';

// POST /api/jobs/applications/:id/shortlist – shortlist a candidate (recruiter only)
export async function onRequestPost(context) {
  const { env, params, data } = context;
  const appId = params.id;
  const user = data.user;

  if (user.role !== 'RECRUITER') {
    return errorResponse('Only recruiters can shortlist candidates', 403);
  }

  const app = await env.CSAS_DB.prepare(`
    SELECT a.*, j.recruiter_id FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ?
  `).bind(appId).first();

  if (!app) return errorResponse('Application not found', 404);
  if (app.recruiter_id !== parseInt(user.id)) {
    return errorResponse('Not authorized', 403);
  }

  await env.CSAS_DB.prepare(`
    UPDATE applications SET status = 'SHORTLISTED', updated_at = datetime('now') WHERE id = ?
  `).bind(appId).run();

  return jsonResponse({ status: 'Candidate shortlisted.' });
}
