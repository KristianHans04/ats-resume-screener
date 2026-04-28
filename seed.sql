-- CSAS Engine Seed Data
-- Run with: npm run db:seed

-- Demo Recruiter (email: recruiter@example.com, password: password)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('recruiter', 'recruiter@example.com', '1ada65ad980449a2ed1d85eff7506caa:94027a57ef0e32c6298562180d4b02b7ef25e488aedd9fc169426277dd7a6989', 'RECRUITER');

-- Demo Candidate (email: candidate@example.com, password: password)
INSERT OR IGNORE INTO users (username, email, password_hash, role)
VALUES ('candidate', 'candidate@example.com', 'a88b3876deb1cf37462400e42ffa0581:c477840bbfcd9c9763467fdae4d5dd348b19d1ad78810a2a99ad811aa1b8f362', 'CANDIDATE');

DELETE FROM jobs
WHERE recruiter_id = (SELECT id FROM users WHERE email = 'recruiter@example.com');

-- Sample Jobs
INSERT INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id)
VALUES
(
  'Senior Backend Engineer',
  'Safaricom PLC',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 350,000 - 500,000',
  'Design and scale backend services that support high-volume digital payments, customer-facing APIs, and internal operational platforms.',
  '- 5+ years Python, Django, or FastAPI experience
- Distributed systems and event-driven architecture
- PostgreSQL, Redis, and queue-based workflows
- Docker and Kubernetes operations
- Secure API design and observability',
  '- Build resilient services for customer and partner platforms
- Lead architecture reviews and mentor engineers
- Improve reliability, logging, and deployment workflows
- Work closely with data, product, and mobile teams',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Product Designer',
  'Safaricom PLC',
  'Design',
  'Nairobi, Kenya',
  'Full-time',
  'KES 220,000 - 320,000',
  'Shape customer journeys for digital products across self-service, fintech, and commerce experiences with a strong systems-thinking mindset.',
  '- 4+ years product design experience
- Figma, prototyping, and design systems
- UX research and journey mapping
- Accessibility and mobile-first interaction design
- Strong product communication skills',
  '- Own flows from concept to handoff
- Run lightweight research and usability reviews
- Maintain scalable component patterns
- Partner with engineers and product managers',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Senior Frontend Engineer',
  'Andela',
  'Web Development',
  'Remote',
  'Contract',
  'USD 4,500 - 6,500',
  'Build polished enterprise web interfaces for globally distributed product teams, with an emphasis on accessibility, performance, and clean frontend architecture.',
  '- 4+ years React or Next.js experience
- TypeScript and component architecture
- State management and API integration
- Frontend testing and accessibility standards
- Strong written communication in remote teams',
  '- Deliver production-ready interfaces from design files
- Collaborate with international engineering teams
- Improve performance and maintainability
- Write tests and document component patterns',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Platform DevOps Engineer',
  'Andela',
  'Engineering',
  'Remote',
  'Contract',
  'USD 5,000 - 7,000',
  'Support cloud infrastructure, deployment automation, and developer experience for client delivery teams working across multiple regions.',
  '- Terraform and infrastructure as code
- AWS or GCP production operations
- CI/CD pipelines and container orchestration
- Monitoring, alerting, and incident response
- Linux and scripting proficiency',
  '- Standardize platform tooling across teams
- Automate delivery and environment provisioning
- Improve reliability, security, and cost visibility
- Partner with application engineers on release workflows',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Data Scientist',
  'M-KOPA',
  'Analytics',
  'Nairobi, Kenya',
  'Full-time',
  'KES 280,000 - 420,000',
  'Develop models and analytical products that support credit risk, customer behavior analysis, and decision automation across digital finance products.',
  '- Python for modelling and experimentation
- SQL and large-scale data analysis
- Applied machine learning in production
- Feature engineering and model evaluation
- Communication with product and operations stakeholders',
  '- Build models for customer segmentation and risk scoring
- Work with analytics engineering on datasets and pipelines
- Explain model performance to non-technical teams
- Support experimentation and decision tooling',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Risk Analytics Manager',
  'Absa Bank Kenya PLC',
  'Analytics',
  'Nairobi, Kenya',
  'Full-time',
  'KES 420,000 - 620,000',
  'Lead analytical work that improves credit oversight, portfolio reporting, and operational risk insight across retail and business banking portfolios.',
  '- Advanced SQL and BI reporting
- Credit risk or financial analytics experience
- Stakeholder reporting and executive communication
- Forecasting, KPI design, and data storytelling
- Team leadership and project planning',
  '- Oversee portfolio monitoring and analytical reporting
- Coordinate with risk, finance, and operations leaders
- Improve dashboard quality and decision support
- Guide analysts on methodology and delivery standards',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
);
