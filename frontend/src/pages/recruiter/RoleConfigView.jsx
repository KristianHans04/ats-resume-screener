import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
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

export default function RoleConfigView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await apiFetch('/jobs/jobs/');
        setJobs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.employment_type === filter);

  return (
    <div className="page-shell flex flex-col gap-8 max-w-5xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">

      {/* Header */}
      <div className="surface-divider flex flex-col md:flex-row md:justify-between md:items-end border-b pb-6 gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-1">Recruiter Portal</p>
          <h1 className="page-heading font-display text-3xl">Jobs & Roles</h1>
          <p className="page-copy text-sm mt-1">Manage your active listings and review applicants.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/recruiter/create-job')}>
          + Post New Job
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Roles', value: jobs.length },
          { label: 'Total Applicants', value: jobs.reduce((a, j) => a + (j.applications?.length || 0), 0) },
          { label: 'Departments', value: new Set(jobs.map(j => j.department)).size },
        ].map(stat => (
          <div key={stat.label} className="surface-card rounded-xl p-4 text-center">
            <p className="page-heading font-display text-3xl">{stat.value}</p>
            <p className="page-label font-mono text-[10px] tracking-widest uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['All', 'Full-time', 'Internship', 'Contract', 'Part-time'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-mono text-xs tracking-widest uppercase px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-accent text-white border-accent'
                : 'surface-card page-copy hover:border-accent/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading && <p className="page-copy">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="page-copy">No jobs found.</p>}
        {!loading && filtered.map(job => (
          <div key={job.id} className="surface-card flex flex-col rounded-2xl p-6 transition-all hover:border-accent/30 hover:shadow-md">
            
            {/* Top */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="page-label font-mono text-[10px] tracking-widest uppercase mb-1">{job.company}</p>
                <h3 className="page-heading font-display text-lg">{job.title}</h3>
              </div>
              <span className="font-mono text-[10px] uppercase bg-emerald-50 text-emerald-600 px-2 py-1 rounded border border-emerald-200 shrink-0">
                Active
              </span>
            </div>

            {/* Meta */}
            <div className="page-copy flex flex-wrap gap-3 text-xs mb-4">
              <span className="flex items-center gap-1"><MapPinIcon /> {job.location}</span>
              <span className="flex items-center gap-1"><ClockIcon /> {job.employment_type}</span>
              <span className="flex items-center gap-1"><UsersIcon /> {job.applications?.length || 0} applicants</span>
            </div>

            {/* About snippet */}
            <p className="page-copy text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>

            {/* Department */}
            <div className="flex gap-3 mb-4">
              <span className="surface-pill font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded">
                {job.department}
              </span>
            </div>

            {/* Actions */}
            <div className="surface-divider mt-auto flex justify-between items-center gap-3 border-t pt-4">
              <button
                className="page-label text-xs hover:text-red-500 transition-colors font-mono uppercase tracking-widest"
                onClick={() => {}}
              >
                Close Role
              </button>
              <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter/ranking-board?jobId=${job.id}`)}>
                View Applicants
              </Button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
