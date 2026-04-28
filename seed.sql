-- CSAS Engine Seed Data
-- Run with: npm run db:seed

-- Demo Recruiter (email: recruiter@example.com, password: password)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('recruiter', 'recruiter@example.com', '1ada65ad980449a2ed1d85eff7506caa:94027a57ef0e32c6298562180d4b02b7ef25e488aedd9fc169426277dd7a6989', 'RECRUITER');

-- Demo Candidate (email: candidate@example.com, password: password)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('candidate', 'candidate@example.com', 'a88b3876deb1cf37462400e42ffa0581:c477840bbfcd9c9763467fdae4d5dd348b19d1ad78810a2a99ad811aa1b8f362', 'CANDIDATE');

-- Sample Jobs
INSERT OR IGNORE INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id)
VALUES (
  'Senior Backend Engineer',
  'Safaricom PLC',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 350,000 - 500,000',
  'We are looking for a Senior Backend Engineer to design and build scalable microservices that power our M-Pesa platform. You will work with a distributed team to architect systems that handle millions of transactions daily.',
  '- 5+ years Python/Django or FastAPI experience
- Distributed Systems Architecture
- Kubernetes and Docker orchestration
- PostgreSQL, Redis, and message queue expertise
- RESTful API design and GraphQL
- CI/CD pipeline management',
  '- Design and implement high-throughput backend services
- Lead code reviews and mentor junior engineers
- Collaborate with product and mobile teams
- Manage database schemas and migrations
- Monitor system performance and optimize bottlenecks',
  1
);

INSERT OR IGNORE INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id)
VALUES (
  'Data Analyst Intern',
  'Equity Bank',
  'Analytics',
  'Nairobi, Kenya',
  'Internship',
  'KES 30,000 - 50,000',
  'Join our analytics team to help transform raw banking data into actionable insights. This internship offers hands-on experience with real financial datasets and modern analytics tools.',
  '- Proficiency in Python (pandas, numpy)
- SQL fundamentals
- Data visualization (Tableau or Power BI)
- Basic statistics knowledge
- Strong communication skills',
  '- Clean and preprocess transaction datasets
- Build dashboards for business stakeholders
- Assist in monthly reporting and KPI tracking
- Document data pipelines and processes',
  1
);

INSERT OR IGNORE INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id)
VALUES (
  'Frontend Developer',
  'Andela',
  'Web Development',
  'Remote',
  'Contract',
  'USD 3,000 - 5,000',
  'We need a skilled Frontend Developer to build responsive, accessible web applications for our global clients. You will work in an agile environment with designers and backend engineers.',
  '- 3+ years React.js or Vue.js experience
- TypeScript proficiency
- CSS/Tailwind CSS expertise
- REST API integration
- Git version control
- Responsive design and accessibility (WCAG)',
  '- Implement pixel-perfect UI from Figma designs
- Write unit and integration tests
- Optimize web performance and Core Web Vitals
- Participate in sprint planning and retrospectives
- Maintain component documentation',
  1
);
