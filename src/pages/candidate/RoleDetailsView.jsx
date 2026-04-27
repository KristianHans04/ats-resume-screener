import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';

/* ── Mock Database for Job Descriptions ── */
const MOCK_ROLE_DETAILS = {
  'role-001': {
    title: 'Senior Backend Engineer',
    company: 'Safaricom PLC',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    department: 'Engineering Dept',
    about: 'We are seeking a Senior Backend Engineer to architect and scale our core payment infrastructure. You will be responsible for building high-throughput, low-latency microservices that process millions of transactions daily.',
    responsibilities: [
      'Design and implement robust APIs using Python and FastAPI.',
      'Manage database schemas and optimize PostgreSQL queries for scale.',
      'Lead the migration of legacy monoliths to Kubernetes-orchestrated microservices.',
      'Own the CI/CD pipeline to ensure zero-downtime deployments.'
    ],
    requirements: [
      '5+ years of experience in backend systems development.',
      'Deep understanding of RESTful API design and distributed systems.',
      'Hands-on experience with Docker, Kubernetes, and AWS infrastructure.'
    ]
  },
  'role-002': {
    title: 'Data Scientist',
    company: 'Kenya Revenue Authority',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    department: 'Analytics Dept',
    about: 'Join our central analytics team to build predictive models that identify anomalies and optimize revenue collection processes across national databases.',
    responsibilities: [
      'Develop machine learning models for anomaly detection and risk scoring.',
      'Process and clean massive datasets using PySpark and SQL.',
      'Collaborate with policy teams to translate tax requirements into algorithmic rules.',
      'Deploy models into production via REST APIs.'
    ],
    requirements: [
      '3+ years of experience in Data Science or Machine Learning.',
      'Strong proficiency in Python, Pandas, Scikit-Learn, and SQL.',
      'Experience with deploying models to production environments.'
    ]
  },
  'role-003': {
    title: 'Frontend Developer Intern',
    company: 'JHUB Africa',
    location: 'Juja, Kenya',
    type: 'Internship',
    department: 'Web Development',
    about: 'We are looking for a passionate Frontend Developer Intern to help build responsive, accessible, and highly interactive user interfaces for our latest agritech platform.',
    responsibilities: [
      'Translate UI/UX wireframes from Figma into high-quality React code.',
      'Optimize application components for maximum speed across web-capable devices.',
      'Write clean, maintainable Tailwind CSS utility classes.',
      'Participate in code reviews and agile sprint planning.'
    ],
    requirements: [
      'Currently pursuing a BSc in Computer Science or related field.',
      'Strong foundation in HTML, CSS, JavaScript (ES6+), and React.',
      'Familiarity with Git version control and RESTful API integration.'
    ]
  }
};

export default function RoleDetailsView() {
  const navigate = useNavigate();
  
  // Grab the roleId from the URL (e.g., "role-002")
  const { roleId } = useParams(); 

  // Look up the specific role data
  const role = MOCK_ROLE_DETAILS[roleId];

  // Fallback UI if someone types a random ID in the URL
  if (!role) {
    return (
      <div className="min-h-screen w-full bg-neutral-light flex flex-col items-center justify-center font-body">
        <h2 className="text-2xl text-neutral-dark mb-4">Role Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/candidate/apply')}>Return to Job Feed</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-3xl mx-auto bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header Banner - Now Dynamic! */}
        <div className="p-8 md:p-10 border-b border-border bg-gray-50">
          <Button variant="ghost" size="sm" className="-ml-3 mb-6" onClick={() => navigate('/candidate/apply')}>
            ← Back to Roles
          </Button>
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">{role.company}</p>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight mb-4">{role.title}</h1>
          <div className="flex flex-wrap gap-3 font-mono text-xs text-gray-500">
            <span className="bg-white border border-border px-3 py-1 rounded-full">{role.location}</span>
            <span className="bg-white border border-border px-3 py-1 rounded-full">{role.type}</span>
            <span className="bg-white border border-border px-3 py-1 rounded-full">{role.department}</span>
          </div>
        </div>

        {/* Job Description Content - Now Dynamic! */}
        <div className="p-8 md:p-10 space-y-8 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-lg text-neutral-dark mb-3">About the Role</h2>
            <p>{role.about}</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-neutral-dark mb-3">Core Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              {role.responsibilities.map((resp, idx) => (
                <li key={idx}>{resp}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg text-neutral-dark mb-3">Required Capabilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              {role.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Action Footer */}
        <div className="p-8 md:p-10 border-t border-border bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-neutral-dark">Ready to apply?</h3>
            <p className="text-xs text-gray-500">You will need your resume in PDF format.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate(`/candidate/apply/${roleId}/upload`)}>
            Proceed to Upload Resume
          </Button>
        </div>

      </div>
    </div>
  );
}