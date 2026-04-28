import { jsonResponse, errorResponse } from '../../../lib/response.js';

// GET /api/jobs/jobs – list all jobs
export async function onRequestGet(context) {
  const { env, data } = context;
  const user = data.user;

  const jobs = await env.CSAS_DB.prepare(`
    SELECT j.*, u.username as recruiter_username
    FROM jobs j
    JOIN users u ON j.recruiter_id = u.id
    WHERE j.is_active = 1
    ORDER BY j.created_at DESC
  `).all();

  // For each job, check if the current user (candidate) has applied
  const results = [];
  for (const job of jobs.results) {
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

    results.push({
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

  return jsonResponse(results);
}

// POST /api/jobs/jobs – create a new job (recruiters only)
export async function onRequestPost(context) {
  const { request, env, data } = context;
  const user = data.user;

  if (user.role !== 'RECRUITER') {
    return errorResponse('Only recruiters can create jobs', 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body');
  }

  const { title, company, department, location, employment_type, salary, description, requirements, responsibilities } = body;

  if (!title || !company || !description) {
    return errorResponse('Title, company, and description are required');
  }

  const result = await env.CSAS_DB.prepare(`
    INSERT INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    title, company, department || null, location || null,
    employment_type || null, salary || null, description,
    requirements || null, responsibilities || null,
    parseInt(user.id)
  ).run();

  const job = await env.CSAS_DB.prepare('SELECT * FROM jobs WHERE id = ?')
    .bind(result.meta.last_row_id).first();

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
    recruiter: user.username,
    created_at: job.created_at,
    application_status: null,
    application_id: null,
  }, 201);
}
