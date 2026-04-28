import { jsonResponse, errorResponse } from '../../../lib/response.js';

// GET /api/jobs/jobs – list all jobs
export async function onRequestGet(context) {
  const { env, data } = context;
  const user = data.user;

  const jobs = await env.CSAS_DB.prepare(`
    SELECT
      j.*,
      u.username as recruiter_username,
      COUNT(a.id) as application_count,
      SUM(CASE WHEN a.status = 'SHORTLISTED' THEN 1 ELSE 0 END) as shortlisted_count,
      ROUND(AVG(CASE WHEN a.ai_score IS NOT NULL THEN a.ai_score END), 2) as avg_ai_score
    FROM jobs j
    JOIN users u ON j.recruiter_id = u.id
    LEFT JOIN applications a ON a.job_id = j.id
    WHERE j.is_active = 1
    GROUP BY j.id
    ORDER BY j.created_at DESC
  `).all();

  // For each job, include extra data depending on role
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
      recruiter_id: job.recruiter_id,
      application_count: Number(job.application_count) || 0,
      shortlisted_count: Number(job.shortlisted_count) || 0,
      avg_ai_score: job.avg_ai_score ?? null,
      is_active: Boolean(job.is_active),
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
    recruiter_id: parseInt(user.id),
    application_count: 0,
    shortlisted_count: 0,
    avg_ai_score: null,
    created_at: job.created_at,
    application_status: null,
    application_id: null,
  }, 201);
}
