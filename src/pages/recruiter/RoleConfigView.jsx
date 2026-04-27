import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C11 11 13 8.82843 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 8.82843 5 11 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 13C1 10.5 3.5 9 6 9C8.5 9 11 10.5 11 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M11 7C12.5 7 14 8 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
  </svg>
);

export const POSTED_JOBS = [
  {
    id: 'role-001',
    title: 'Senior Backend Engineer',
    company: 'Safaricom PLC',
    department: 'Engineering',
    location: 'Nairobi, Kenya (Hybrid)',
    type: 'Full-time',
    status: 'Active',
    applicants: 24,
    about: 'Lead the design and development of scalable backend services powering Safaricom\'s digital products used by millions across Kenya.',
    requirements: '5+ years Python/FastAPI, Distributed Systems Architecture, Kubernetes Orchestration, PostgreSQL, REST & GraphQL APIs',
    qualifications: "Bachelor's degree in Computer Science or related field. Experience in fintech or telecoms a strong plus.",
    salary: 'KES 250,000 – 350,000 / month',
    deadline: '2026-05-30',
  },
  {
    id: 'role-002',
    title: 'Data Scientist',
    company: 'Kenya Revenue Authority',
    department: 'Analytics',
    location: 'Nairobi, Kenya (On-site)',
    type: 'Full-time',
    status: 'Active',
    applicants: 17,
    about: 'Apply advanced ML models to detect tax anomalies, forecast revenue trends and support policy decisions using large-scale government data.',
    requirements: '3+ years Python/R, Machine Learning (scikit-learn, XGBoost), SQL, Data Visualisation (Tableau/Power BI), Statistical Modelling',
    qualifications: "Master's degree in Data Science, Statistics, or related discipline. Public sector experience preferred.",
    salary: 'KES 180,000 – 240,000 / month',
    deadline: '2026-05-15',
  },
  {
    id: 'role-003',
    title: 'Frontend Developer Intern',
    company: 'JHUB Africa',
    department: 'Web Development',
    location: 'Juja, Kenya (Remote)',
    type: 'Internship',
    status: 'Active',
    applicants: 41,
    about: 'Join the JHUB Africa product team to build responsive web interfaces for student-facing innovation platforms across East Africa.',
    requirements: 'React.js, Tailwind CSS, REST API Integration, Git, Figma-to-code implementation',
    qualifications: 'Currently pursuing a degree in Computer Science, IT, or related field. Portfolio of personal/academic projects required.',
    salary: 'KES 25,000 – 40,000 / month',
    deadline: '2026-05-10',
  },
];

export default function RoleConfigView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? POSTED_JOBS : POSTED_JOBS.filter(j => j.type === filter);

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-border pb-6 gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-1">Recruiter Portal</p>
          <h1 className="font-display text-3xl text-neutral-dark">Jobs & Roles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your active listings and review applicants.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/recruiter/create-job')}>
          + Post New Job
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Roles', value: POSTED_JOBS.length },
          { label: 'Total Applicants', value: POSTED_JOBS.reduce((a, j) => a + j.applicants, 0) },
          { label: 'Departments', value: new Set(POSTED_JOBS.map(j => j.department)).size },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-border rounded-xl p-4 text-center shadow-sm">
            <p className="font-display text-3xl text-neutral-dark">{stat.value}</p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Full-time', 'Internship'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-lg border transition-all ${
              filter === f
                ? 'bg-accent text-white border-accent'
                : 'bg-white text-gray-500 border-border hover:border-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(job => (
          <div key={job.id} className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all flex flex-col">
            
            {/* Top */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-1">{job.company}</p>
                <h3 className="font-display text-lg text-neutral-dark">{job.title}</h3>
              </div>
              <span className="font-mono text-[10px] uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-200 shrink-0">
                {job.status}
              </span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1"><MapPinIcon /> {job.location}</span>
              <span className="flex items-center gap-1"><ClockIcon /> {job.type}</span>
              <span className="flex items-center gap-1"><UsersIcon /> {job.applicants} applicants</span>
            </div>

            {/* About snippet */}
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">{job.about}</p>

            {/* Department + Deadline */}
            <div className="flex gap-3 mb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-gray-50 border border-border text-gray-500 px-2 py-1 rounded">
                {job.department}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest bg-orange-50 border border-orange-100 text-orange-500 px-2 py-1 rounded">
                Deadline: {job.deadline}
              </span>
            </div>

            {/* Salary */}
            <p className="text-sm font-semibold text-neutral-dark mb-4">{job.salary}</p>

            {/* Actions */}
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center gap-3">
              <button
                className="text-xs text-gray-400 hover:text-red-500 transition-colors font-mono uppercase tracking-widest"
                onClick={() => {}}
              >
                Close Role
              </button>
              <Button variant="outline" size="sm" onClick={() => navigate('/recruiter/ranking-board')}>
                View Applicants
              </Button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}