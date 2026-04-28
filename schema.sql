-- CSAS Engine D1 Schema
-- Cloudflare D1 (SQLite-compatible)

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('RECRUITER', 'CANDIDATE')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  department TEXT,
  location TEXT,
  employment_type TEXT,
  salary TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  recruiter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_key TEXT,
  resume_text TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK(status IN ('PENDING','PARSING','AWAITING_INQUIRY','EVALUATING','SCORED','COMPLETED','SHORTLISTED','REJECTED','FAILED')),
  ai_score REAL,
  resume_score REAL,
  semantic_gaps TEXT,
  generated_questions TEXT,
  answers TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(job_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter ON jobs(recruiter_id);
