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

-- ------------------------------------------
--  50 Kenyan Jobs (Senior/Mid first, then
--  Junior/Intern/Attachment last so they
--  appear first when sorted by newest)
-- ------------------------------------------
INSERT INTO jobs (title, company, department, location, employment_type, salary, description, requirements, responsibilities, recruiter_id) VALUES

-- -- 1. Senior/Mid-level roles -------------
(
  'Senior Backend Engineer',
  'Safaricom PLC',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 350,000 - 500,000',
  'Design and scale backend services that support high-volume digital payments, customer-facing APIs, and internal operational platforms across the Safaricom ecosystem.',
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
  '- Standardise platform tooling across teams
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
  'Develop models and analytical products that support credit risk, customer behaviour analysis, and decision automation across digital finance products.',
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
),
(
  'Branch Manager',
  'KCB Group',
  'Retail Banking',
  'Mombasa, Kenya',
  'Full-time',
  'KES 300,000 - 450,000',
  'Lead the Mombasa branch to deliver strong business development results, exceptional service standards, and a motivated team of banking professionals.',
  '- 6+ years banking experience, 2+ in management
- Business development and relationship management
- KYC, compliance, and credit risk awareness
- Team leadership and performance management
- CPA or relevant financial qualification',
  '- Drive deposit growth and loan book performance
- Build and maintain corporate and retail relationships
- Ensure full compliance with CBK and bank policies
- Coach and develop branch staff',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Mobile Money Product Manager',
  'Equity Bank Kenya',
  'Digital Products',
  'Nairobi, Kenya',
  'Full-time',
  'KES 380,000 - 550,000',
  'Own the product roadmap for Equitel and EazzyPay mobile money features, working with engineering, compliance, and commercial teams to drive growth.',
  '- 4+ years product management in fintech or mobile money
- Agile delivery and roadmap prioritisation
- Mobile UX understanding and cross-functional coordination
- Regulatory and compliance awareness for financial products
- Data-driven product decision-making',
  '- Define product vision and quarterly OKRs
- Manage engineering sprints and feature releases
- Conduct user research and synthesise insights
- Monitor adoption metrics and resolve blockers',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Digital Marketing Lead',
  'Nation Media Group',
  'Marketing',
  'Nairobi, Kenya',
  'Full-time',
  'KES 250,000 - 360,000',
  'Drive digital audience growth and advertising revenue across NMG platforms including Daily Nation, Nation.Africa, and NTV through paid, owned, and earned media.',
  '- 4+ years digital marketing, preferably media or content
- SEO, SEM, and programmatic advertising expertise
- Google Analytics, social media strategy, and email automation
- Content strategy and editorial alignment
- Strong data interpretation skills',
  '- Manage paid digital campaigns and optimize ROI
- Grow organic traffic across NMG web properties
- Collaborate with editorial and commercial teams
- Produce weekly performance reports for leadership',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Cybersecurity Analyst',
  'Airtel Kenya',
  'IT Security',
  'Nairobi, Kenya',
  'Full-time',
  'KES 280,000 - 400,000',
  'Monitor and protect the Airtel Kenya network and digital infrastructure against threats, vulnerabilities, and unauthorised access incidents.',
  '- 3+ years cybersecurity experience in telecoms or ISP
- SIEM, IDS/IPS, and firewall management
- Incident response and forensics
- ISO 27001, NIST, or similar framework knowledge
- CEH, CISSP, or CISM certification preferred',
  '- Conduct vulnerability assessments and penetration tests
- Monitor security operations centre alerts
- Respond to and document security incidents
- Drive security awareness training across the business',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Electrical Engineer',
  'Kenya Power',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 200,000 - 320,000',
  'Support grid maintenance, fault rectification, and power infrastructure projects to ensure reliable electricity distribution across the service area.',
  '- BSc Electrical Engineering or equivalent
- 3+ years distribution network experience
- AutoCAD, SCADA, and load flow analysis
- ERC and safety regulation compliance
- Strong technical report writing',
  '- Investigate and resolve distribution system faults
- Plan and execute infrastructure upgrade projects
- Prepare technical specifications for procurement
- Coordinate with contractors and county governments',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Senior Audit Associate',
  'Deloitte Kenya',
  'Audit & Assurance',
  'Nairobi, Kenya',
  'Full-time',
  'KES 240,000 - 380,000',
  'Lead audit fieldwork for listed companies, financial institutions, and public sector clients, applying IFRS and ISA standards with precision.',
  '- CPA (K) or ACCA finalist or qualified
- 3+ years external audit experience
- IFRS and ISA knowledge
- Advanced Excel and audit tools (CaseWare preferred)
- Strong analytical and communication skills',
  '- Plan and execute audit engagements from start to finish
- Review team workpapers and coaching associates
- Draft management letters and audit reports
- Present findings to client finance teams',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Software Engineer - Payments',
  'Flutterwave Kenya',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 300,000 - 480,000',
  'Build and maintain core payment processing systems that power cross-border transactions for thousands of businesses across Africa.',
  '- 3+ years in backend software engineering
- Node.js or Python for high-throughput systems
- Payment processing, fraud detection, or fintech domain
- REST API design and microservices
- PostgreSQL and Redis',
  '- Develop and maintain payment gateway integrations
- Optimise transaction throughput and reliability
- Build internal tools for finance and operations teams
- Participate in on-call rotation for critical incidents',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Supply Chain Manager',
  'Unilever Kenya',
  'Operations',
  'Nairobi, Kenya',
  'Full-time',
  'KES 350,000 - 520,000',
  'Oversee end-to-end supply chain operations for East Africa including procurement, planning, logistics, and demand management for key FMCG brands.',
  '- 5+ years supply chain or logistics management
- SAP or similar ERP system experience
- S&OP, demand forecasting, and inventory optimisation
- Supplier relationship and contract management
- Strong cross-functional leadership',
  '- Lead monthly S&OP cycle and demand planning
- Negotiate supplier contracts and service levels
- Drive cost reduction and waste elimination projects
- Build supply chain capability in the team',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Tax Manager',
  'PwC Kenya',
  'Tax Advisory',
  'Nairobi, Kenya',
  'Full-time',
  'KES 400,000 - 600,000',
  'Deliver high-quality tax advisory and compliance services to corporates, multinationals, and financial institutions operating in East Africa.',
  '- CPA (K) or equivalent with 6+ years tax experience
- Corporate and international tax advisory
- Transfer pricing and treaty analysis
- KRA audit defence and dispute resolution
- Strong client relationship management',
  '- Manage tax engagements and client relationships
- Provide advisory on M&A, restructuring, and cross-border tax
- Review and sign-off tax returns and computations
- Lead and mentor tax associates',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),

-- -- 2. Mid-level roles ---------------------
(
  'UX Researcher',
  'Cellulant',
  'Product & Design',
  'Nairobi, Kenya',
  'Full-time',
  'KES 180,000 - 260,000',
  'Conduct user research to guide product decisions for payment and agri-commerce solutions used by farmers, merchants, and financial institutions.',
  '- 2+ years UX research experience
- Qualitative and quantitative research methods
- Usability testing and journey mapping
- Ability to work in low-connectivity field contexts
- Strong synthesis and communication skills',
  '- Plan and run research sessions across user groups
- Synthesise insights into design and product recommendations
- Facilitate co-design workshops with stakeholders
- Maintain a user research repository',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Data Analyst',
  'Twiga Foods',
  'Analytics',
  'Nairobi, Kenya',
  'Full-time',
  'KES 150,000 - 230,000',
  'Analyse supply chain, sales, and farmer data to surface insights that improve food distribution efficiency across Twiga''s network.',
  '- 2+ years data analysis experience
- Python or R, and advanced SQL
- Data visualisation with Tableau or Power BI
- Supply chain or e-commerce domain knowledge a plus
- Strong written communication',
  '- Build and maintain dashboards for operations and leadership
- Model demand and supply patterns across the network
- Identify inefficiencies in routing, pricing, or procurement
- Present weekly analytical briefs to product and ops teams',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'People Operations Specialist',
  'M-KOPA',
  'People & Culture',
  'Nairobi, Kenya',
  'Full-time',
  'KES 160,000 - 240,000',
  'Support the full employee lifecycle including recruitment, onboarding, performance management, and employee relations across M-KOPA Kenya.',
  '- 3+ years HR or people operations experience
- CHRP or HND in HR Management
- Employment law and labour relations in Kenya
- HRIS systems and HR data reporting
- Strong empathy and confidentiality skills',
  '- Coordinate end-to-end recruitment and onboarding
- Manage performance review cycles and documentation
- Handle employee relations issues and escalations
- Produce HR reports for leadership and compliance',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Flight Operations Officer',
  'Kenya Airways',
  'Operations',
  'Nairobi, Kenya',
  'Full-time',
  'KES 200,000 - 300,000',
  'Coordinate flight dispatch, crew scheduling, and operational communications to ensure safe and on-time departures across the KQ network.',
  '- Dispatch licence or aeronautical qualification
- 2+ years airline operations experience
- Crew Resource Management and NOTAM reading
- Strong situational awareness under pressure
- Shift work flexibility',
  '- Prepare and release operational flight plans
- Monitor weather, NOTAMs, and airspace restrictions
- Coordinate with crew, ground, and ATC teams
- Maintain flight operations documentation and logs',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Logistics Coordinator',
  'Sendy',
  'Operations',
  'Nairobi, Kenya',
  'Full-time',
  'KES 120,000 - 180,000',
  'Oversee last-mile delivery coordination, driver partner support, and SLA management across Sendy''s Nairobi operations network.',
  '- 2+ years logistics or operations experience
- Fleet management or route optimisation knowledge
- Customer service and escalation handling
- Google Sheets and basic data skills
- Valid driver''s licence preferred',
  '- Manage daily dispatch and delivery scheduling
- Monitor driver partner performance and compliance
- Resolve delivery exceptions and customer escalations
- Prepare daily operations summaries',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Public Health Programme Officer',
  'PATH Kenya',
  'Programme Management',
  'Nairobi, Kenya',
  'Full-time',
  'KES 180,000 - 280,000',
  'Manage field implementation of health programmes in maternal, reproductive, and child health, coordinating with county governments and community health workers.',
  '- BSc or MPH in Public Health or related field
- 3+ years programme implementation experience
- Knowledge of Kenya health system and NHIF
- Monitoring, evaluation, and report writing
- Fluency in Swahili and English',
  '- Coordinate CHW training and supportive supervision
- Maintain programme data and produce donor reports
- Liaise with MoH and county health teams
- Support health commodity supply chains',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Financial Analyst',
  'I&M Bank',
  'Finance',
  'Nairobi, Kenya',
  'Full-time',
  'KES 160,000 - 240,000',
  'Support financial planning, analysis, and reporting functions for a fast-growing bank with a strong regional footprint.',
  '- CPA (K) Part 2 or equivalent
- 2+ years financial analysis or treasury experience
- Advanced Excel and financial modelling
- IFRS 9 and banking financial statements knowledge
- Attention to detail and data integrity',
  '- Prepare monthly management accounts and variance analysis
- Build and maintain financial forecast models
- Support the annual budgeting and planning cycle
- Produce regulatory and board reporting packs',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Hotel Operations Supervisor',
  'Radisson Blu Nairobi',
  'Hospitality',
  'Nairobi, Kenya',
  'Full-time',
  'KES 120,000 - 180,000',
  'Supervise front office, housekeeping, and F&B operations to maintain Radisson Blu service standards and high guest satisfaction scores.',
  '- Diploma or degree in Hospitality Management
- 3+ years hotel supervisory experience
- Opera PMS and Micros proficiency
- Guest complaint handling and service recovery
- Fluency in English and Swahili',
  '- Oversee shift operations across multiple departments
- Monitor and coach team performance against brand standards
- Handle guest feedback and service recovery situations
- Prepare shift handover reports and incident logs',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Development Programme Officer',
  'Aga Khan Foundation',
  'Programmes',
  'Nairobi, Kenya',
  'Full-time',
  'KES 180,000 - 270,000',
  'Coordinate community development programmes in education, health, and economic inclusion across AKF Kenya project sites.',
  '- Degree in Development Studies, Social Work, or related
- 3+ years NGO or development sector experience
- Logical framework and M&E methodology
- Strong community engagement and facilitation skills
- Experience with donor reporting (EU, USAID, DFID)',
  '- Plan and implement programme activities
- Engage with community leaders, local government, and donors
- Conduct field monitoring visits and write reports
- Support proposal development and fundraising',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Customs and Trade Compliance Officer',
  'DHL Kenya',
  'Trade Compliance',
  'Nairobi, Kenya',
  'Full-time',
  'KES 140,000 - 220,000',
  'Ensure all DHL Kenya shipments comply with KRA customs requirements, international trade regulations, and company import-export procedures.',
  '- Diploma or degree in Customs/Clearing & Forwarding
- 3+ years customs clearance or trade compliance
- KRA iCMS and KESRA knowledge
- HS tariff classification proficiency
- Analytical and documentation skills',
  '- Process import and export declarations on iCMS
- Advise clients on customs duties and trade facilitation
- Manage relationships with KRA customs officers
- Ensure accurate customs documentation and record keeping',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'FMCG Sales Representative',
  'Bidco Africa',
  'Sales',
  'Nakuru, Kenya',
  'Full-time',
  'KES 80,000 - 130,000',
  'Drive retail distribution and volume targets for Bidco cooking oils, soaps, and personal care brands across Nakuru and Rift Valley territories.',
  '- Diploma or degree in Sales, Business, or Marketing
- 2+ years FMCG field sales experience
- Strong territory management and negotiation skills
- Valid motorcycle or car licence
- Resilient, target-driven, and self-motivated',
  '- Execute weekly call cycles across wholesale and retail outlets
- Achieve monthly volume and revenue targets
- Ensure product visibility and display standards
- Report competitor activity and market intelligence',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),

-- -- 3. Junior / Graduate / Entry-level ----
(
  'Junior Software Developer',
  'Equity Bank Kenya',
  'Technology',
  'Nairobi, Kenya',
  'Full-time',
  'KES 80,000 - 130,000',
  'Join the Equity Bank technology team to build, test, and maintain digital banking features used by millions of Kenyans daily.',
  '- BSc Computer Science, Software Engineering, or equivalent
- Proficiency in Java, Python, or Node.js
- Basic understanding of REST APIs and SQL databases
- Version control with Git
- Eagerness to learn and grow in a fast-paced fintech environment',
  '- Develop features for Equity Mobile and EazzyPay
- Write unit and integration tests for new functionality
- Participate in code reviews and sprint ceremonies
- Maintain technical documentation for your modules',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior Data Analyst',
  'Co-operative Bank of Kenya',
  'Data & Analytics',
  'Nairobi, Kenya',
  'Full-time',
  'KES 70,000 - 110,000',
  'Support the data and analytics team with reporting, data cleaning, and visualisation tasks that improve business decision-making.',
  '- BSc Statistics, Mathematics, Computer Science, or related
- SQL proficiency (intermediate level)
- Excel and at least one BI tool (Power BI or Tableau)
- Attention to detail and data accuracy
- Clear written communication',
  '- Run SQL queries and prepare regular business reports
- Clean and validate datasets for analysis
- Build and update Power BI dashboards
- Support senior analysts on ad-hoc projects',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Graduate Trainee - Technology',
  'NCBA Bank Kenya',
  'Technology',
  'Nairobi, Kenya',
  'Graduate Trainee',
  'KES 65,000 - 80,000',
  'NCBA Bank is seeking motivated technology graduates to join its 12-month Graduate Trainee Programme and rotate across digital, data, and infrastructure teams.',
  '- BSc Computer Science, Information Technology, or related (2023/2024 graduate)
- Basic knowledge of programming, networks, or databases
- Strong analytical thinking and problem-solving
- Excellent communication and teamwork skills
- Willingness to learn and adapt in a banking environment',
  '- Rotate across digital products, infrastructure, and data teams
- Support ongoing technology projects and product sprints
- Participate in mentorship, training, and bank-wide initiatives
- Complete a capstone project at the end of the programme',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Graduate Trainee - Finance',
  'Absa Bank Kenya PLC',
  'Finance',
  'Nairobi, Kenya',
  'Graduate Trainee',
  'KES 65,000 - 85,000',
  'Join the Absa Graduate Trainee Programme in the Finance function and gain exposure to financial reporting, planning, and treasury operations over 12 months.',
  '- BCom, BSc Finance, or Accounting degree (2023/2024 graduate)
- CPA Part 1 or ACCA Fundamentals (advantage)
- Excel skills and numerical confidence
- Organised, detail-oriented, and collaborative
- Eager to build a career in banking finance',
  '- Support financial reporting and month-end close
- Assist with budget preparation and cost analysis
- Prepare financial models and variance commentaries
- Attend finance business partner meetings and take notes',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior UX/UI Designer',
  'Cellulant',
  'Product Design',
  'Nairobi, Kenya',
  'Full-time',
  'KES 75,000 - 110,000',
  'Help design simple, inclusive payment and farmer-facing digital interfaces used across 18 African markets, under mentorship from senior designers.',
  '- BSc or diploma in Design, HCI, or related field
- Figma proficiency and basic prototyping skills
- Understanding of accessibility and inclusive design
- Portfolio demonstrating UI/UX thinking (personal or academic projects welcome)
- Curiosity about design for low-literacy and USSD contexts',
  '- Create wireframes, mockups, and interactive prototypes
- Collaborate with product managers and engineers on feature delivery
- Conduct basic usability tests with users
- Contribute to and maintain the design system',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior HR Assistant',
  'Kenya Airways',
  'Human Resources',
  'Nairobi, Kenya',
  'Full-time',
  'KES 55,000 - 85,000',
  'Support the KQ HR team in recruitment coordination, employee records management, and HR operations across the airline.',
  '- Diploma or degree in HR Management or Business
- 0-1 years HR or administrative experience
- MS Office proficiency, especially Excel
- High attention to detail and confidentiality
- Good interpersonal and communication skills',
  '- Post job vacancies and coordinate interview scheduling
- Maintain and update employee records on the HRIS
- Process HR documentation (contracts, letters, certificates)
- Support payroll and benefits administration tasks',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior Accountant',
  'Bidco Africa',
  'Finance',
  'Thika, Kenya',
  'Full-time',
  'KES 60,000 - 95,000',
  'Support the Bidco Africa finance team with accounts payable, receivable, reconciliations, and month-end reporting for the Thika manufacturing plant.',
  '- CPA Part 2 or BCom Accounting degree
- Sage, QuickBooks, or SAP exposure
- Reconciliations and accounts payable/receivable experience
- High numerical accuracy and a team player attitude
- Willingness to work in a manufacturing environment',
  '- Process supplier invoices and payments
- Conduct monthly bank and supplier reconciliations
- Assist with month-end journals and reporting
- Support the finance manager in audits and statutory filings',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Customer Experience Associate',
  'Safaricom PLC',
  'Customer Experience',
  'Nairobi, Kenya',
  'Full-time',
  'KES 55,000 - 80,000',
  'Deliver excellent service to Safaricom customers across voice, digital, and walk-in channels, resolving queries on M-PESA, data, and voice products.',
  '- Diploma or degree in Business, Communication, or related
- Clear written and verbal communication in English and Swahili
- Patience, empathy, and problem-solving mindset
- Basic computer literacy
- Flexible to work in shifts including weekends',
  '- Handle inbound customer queries via phone, chat, and email
- Resolve complaints and escalations within SLA
- Document interactions accurately in the CRM system
- Upsell relevant products to existing customers',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Content Creator & Social Media Executive',
  'Nation Media Group',
  'Digital',
  'Nairobi, Kenya',
  'Full-time',
  'KES 70,000 - 110,000',
  'Create engaging digital content across NMG social media platforms, grow community engagement, and support editorial and advertising campaigns.',
  '- Degree or diploma in Communications, Journalism, or Digital Media
- Proficiency in Canva, CapCut, or Adobe tools
- Strong writing and storytelling in English and Swahili
- Understanding of TikTok, Instagram, X, and YouTube algorithms
- Portfolio of past social media or content work',
  '- Produce daily content (graphics, short videos, and threads)
- Grow and engage follower communities across platforms
- Track performance metrics and optimise content strategy
- Collaborate with editorial and marketing teams on campaigns',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),

-- -- 4. Internships & Attachments ----------
(
  'Software Engineering Internship',
  'Safaricom PLC',
  'Engineering',
  'Nairobi, Kenya',
  'Internship',
  'KES 25,000 - 35,000',
  'Join Safaricom''s engineering team for a 3-month internship and contribute to real backend systems, APIs, and mobile money integrations under senior mentorship.',
  '- Currently pursuing BSc Computer Science, Software Engineering, or related (Year 3 or 4)
- Exposure to at least one backend language (Python, Java, Node.js)
- Basic understanding of REST APIs and databases
- Eagerness to learn, collaborate, and ask questions
- Ability to commit for the full 3-month period',
  '- Assist with feature development on live systems
- Write unit tests and fix bugs under guidance
- Attend sprint standups and planning sessions
- Document your work for the team knowledge base',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Data Science Internship',
  'M-KOPA',
  'Analytics',
  'Nairobi, Kenya',
  'Internship',
  'KES 20,000 - 30,000',
  'Support M-KOPA''s data science team with model development, data exploration, and analytical storytelling for fintech products that serve the underserved.',
  '- Pursuing BSc Statistics, Data Science, Mathematics, or related
- Python (Pandas, NumPy, Scikit-learn) basics
- SQL and basic data wrangling skills
- Interest in credit risk, financial inclusion, or ML
- Strong curiosity and self-starter attitude',
  '- Explore datasets and produce exploratory analysis reports
- Assist with feature engineering and model experiments
- Build visualisations to communicate findings
- Shadow and support senior data scientists on live projects',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Finance Attachment',
  'KCB Group',
  'Finance',
  'Nairobi, Kenya',
  'Attachment',
  'KES 15,000 - 20,000',
  'Industrial attachment for university students pursuing a degree in Finance, Accounting, or Business, gaining hands-on experience in a major East African bank.',
  '- Currently enrolled in Year 2 or 3 of BCom, BSc Finance, or Accounting degree
- Basic Excel and Microsoft Office skills
- Willingness to learn banking finance operations
- Organised, punctual, and detail-oriented
- Must provide a university attachment letter',
  '- Assist the finance team with data entry and reconciliations
- Shadow financial reporting and budgeting processes
- Prepare simple analytical summaries under supervision
- Attend team meetings and take structured notes',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Marketing Attachment',
  'Equity Bank Kenya',
  'Marketing',
  'Nairobi, Kenya',
  'Attachment',
  'KES 15,000 - 20,000',
  'University attachment for students studying Marketing, Communications, or Business, offering exposure to digital marketing, brand, and campaign execution.',
  '- Currently enrolled in Year 2 or 3 in Marketing, Business, or Communications
- Basic social media and digital tools knowledge
- Good written English and Swahili
- Creative mindset and attention to detail
- University attachment letter required',
  '- Assist with digital content creation and scheduling
- Support campaign coordination and event logistics
- Conduct market research and competitor analysis
- Contribute to weekly marketing reports',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'IT Support Internship',
  'NCBA Bank Kenya',
  'Technology',
  'Nairobi, Kenya',
  'Internship',
  'KES 18,000 - 25,000',
  'A 3-month IT internship supporting NCBA''s IT helpdesk, network, and desktop support operations across the Nairobi head office.',
  '- Currently pursuing Diploma or Degree in IT, Computer Science, or Networking
- Basic knowledge of Windows, Active Directory, and networking fundamentals
- CompTIA A+ or CCNA exposure is a plus
- Customer-service oriented and patient
- Available full-time for the internship period',
  '- Respond to IT helpdesk tickets and user queries
- Assist with hardware setup and software installations
- Support network and printer troubleshooting
- Shadow senior engineers on infrastructure projects',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Graphic Design Internship',
  'Andela',
  'Design',
  'Remote',
  'Internship',
  'USD 400 - 600/month',
  'Remote internship for a graphic design student to support Andela''s brand, marketing, and community design needs across digital and print touchpoints.',
  '- Currently enrolled in Graphic Design, Visual Communication, or related programme
- Proficiency in Figma, Adobe Illustrator, or Photoshop
- Strong visual taste and attention to brand consistency
- Ability to work independently in a remote, async environment
- Portfolio of design work (academic or personal projects accepted)',
  '- Create social media graphics, banners, and presentations
- Assist with brand asset updates and design guidelines
- Collaborate with marketing on campaign visuals
- Iterate designs quickly based on feedback',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior Software Developer - Fintech',
  'Flutterwave Kenya',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 90,000 - 140,000',
  'A great first industry role for a developer ready to build real payment infrastructure used by businesses across Africa, with mentorship from experienced engineers.',
  '- BSc Computer Science, Software Engineering, or equivalent
- Proficiency in Node.js or Python
- Basic understanding of RESTful APIs and SQL
- Eager to learn payment domain, security, and fintech systems
- Collaborative, curious, and ready to take ownership',
  '- Build and maintain API integrations for payment partners
- Write tests and participate in code reviews
- Investigate and resolve production bugs with support
- Document implementation guides for internal and external developers',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior DevOps Engineer',
  'Andela',
  'Engineering',
  'Remote',
  'Full-time',
  'USD 1,500 - 2,500/month',
  'Entry-level DevOps role for someone starting their cloud infrastructure career, working on client projects with guidance from senior DevOps engineers.',
  '- BSc Computer Science, IT, or related field
- Basic Linux, Bash scripting, and networking knowledge
- Exposure to Docker, CI/CD, or cloud platforms (AWS/GCP/Azure)
- Strong desire to learn infrastructure automation
- Good English communication for remote collaboration',
  '- Assist with provisioning and monitoring cloud environments
- Maintain CI/CD pipelines and deployment scripts
- Write infrastructure documentation
- Shadow senior engineers and take on increasing responsibility',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Business Development Internship',
  'Twiga Foods',
  'Commercial',
  'Nairobi, Kenya',
  'Internship',
  'KES 20,000 - 30,000',
  'Support Twiga''s commercial team in identifying new merchant and farmer partners, conducting market research, and building pitch materials.',
  '- Currently enrolled in Business Administration, Economics, or Agribusiness degree
- Strong analytical and communication skills
- Interest in agri-tech, food systems, or supply chain innovation
- Proficient in Excel and Google Slides
- Self-motivated and comfortable in the field',
  '- Research new merchant onboarding opportunities in assigned areas
- Support senior BD team in partner pitches and follow-ups
- Analyse market data and produce weekly territory reports
- Assist with farmer community engagement activities',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Intern - Human Resources',
  'Deloitte Kenya',
  'People & Culture',
  'Nairobi, Kenya',
  'Internship',
  'KES 22,000 - 30,000',
  'Join Deloitte Kenya''s People & Culture team and gain hands-on exposure to talent acquisition, learning & development, and HR operations in a leading professional services firm.',
  '- Currently pursuing a degree in HR Management, Psychology, or Business
- Organised and discreet with sensitive information
- Good interpersonal skills and professional appearance
- Proficiency in MS Office, especially Word and Excel
- Available for a minimum 3-month commitment',
  '- Support recruitment coordination and CV screening
- Assist with onboarding logistics and induction events
- Maintain and update HR records on the HRIS system
- Support L&D events and training administration',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Junior Backend Developer',
  'Safaricom PLC',
  'Engineering',
  'Nairobi, Kenya',
  'Full-time',
  'KES 100,000 - 160,000',
  'A structured entry-level engineering role for recent graduates to grow into backend developers on Safaricom''s internal and customer-facing platforms.',
  '- BSc Computer Science, Software Engineering, or related (graduated 2022-2024)
- Strong foundation in one or more languages: Python, Java, Go, or Node.js
- Understanding of HTTP, APIs, and relational databases
- Problem-solving mindset and desire to grow technically
- Excellent teamwork and written communication',
  '- Build features on internal APIs and data pipelines
- Write automated tests and fix defects under mentorship
- Document code, API contracts, and design decisions
- Participate in daily standups and sprint retrospectives',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
),
(
  'Software Engineering Attachment',
  'Equity Bank Kenya',
  'Technology',
  'Nairobi, Kenya',
  'Attachment',
  'KES 15,000 - 20,000',
  'Industrial attachment for Computer Science and Software Engineering students to gain practical exposure to digital banking systems development.',
  '- Currently enrolled in Year 2 or 3 of BSc Computer Science or Software Engineering
- Basic programming skills in any language (Python, Java, or JavaScript)
- Willingness to learn and contribute under supervision
- Reliable, punctual, and ready to commit for at least 2 months
- University attachment letter required',
  '- Support developers with coding tasks, bug fixes, and testing
- Shadow code reviews and engineering sprint meetings
- Write technical documentation and how-to guides
- Participate in team knowledge sharing sessions',
  (SELECT id FROM users WHERE email = 'recruiter@example.com')
);
