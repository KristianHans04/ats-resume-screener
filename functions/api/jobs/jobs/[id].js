import { jsonResponse, errorResponse } from '../../../lib/response.js';

// GET /api/jobs/jobs/:id – get job details
export async function onRequestGet(context) {
  const { env, params, data } = context;
  const jobId = params.id;
  const user = data.user;

  const job = await env.CSAS_DB.prepare(`
    SELECT j.*, u.username as recruiter_username
    FROM jobs j
    JOIN users u ON j.recruiter_id = u.id
    WHERE j.id = ?
  `).bind(jobId).first();

  if (!job) {
    return errorResponse('Job not found', 404);
  }

  let application_status = null;
  let application_id = null;

  if (user.role === 'CANDIDATE') {
    const app = await env.CSAS_DB.prepare(
      'SELECT id, status FROM applications WHERE job_id = ? AND candidate_id = ?'
    ).bind(job.id, parseInt(user.id)).first();

    if (app) {
      application_status = app.status;
      application_id = app.id;
    }
  }

  return jsonResponse({
    id: job.id,
    title: job.title,
    company: job.company,
    department: job.department,
    location: job.location,
    employment_type: job.employment_type,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    recruiter: job.recruiter_username,
    created_at: job.created_at,
    application_status,
    application_id,
  });
}

// PATCH /api/jobs/jobs/:id – update job (recruiter only)
export async function onRequestPatch(context) {
  const { request, env, params, data } = context;
  const jobId = params.id;
  const user = data.user;

  if (user.role !== 'RECRUITER') {
    return errorResponse('Only recruiters can update jobs', 403);
  }

  const job = await env.CSAS_DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(jobId).first();
  if (!job) return errorResponse('Job not found', 404);
  if (job.recruiter_id !== parseInt(user.id)) return errorResponse('Not authorized', 403);

  let body;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON'); }

  const fields = ['title', 'company', 'department', 'location', 'employment_type', 'salary', 'description', 'requirements', 'responsibilities'];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (updates.length === 0) return errorResponse('No fields to update');

  values.push(jobId);
  await env.CSAS_DB.prepare(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();

  return jsonResponse({ status: 'Job updated' });
}

// DELETE /api/jobs/jobs/:id – delete job (recruiter only)
export async function onRequestDelete(context) {
  const { env, params, data } = context;
  const jobId = params.id;
  const user = data.user;

  if (user.role !== 'RECRUITER') {
    return errorResponse('Only recruiters can delete jobs', 403);
  }

  const job = await env.CSAS_DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(jobId).first();
  if (!job) return errorResponse('Job not found', 404);
  if (job.recruiter_id !== parseInt(user.id)) return errorResponse('Not authorized', 403);

  await env.CSAS_DB.prepare('DELETE FROM jobs WHERE id = ?').bind(jobId).run();

  return jsonResponse({ status: 'Job deleted' });
}
