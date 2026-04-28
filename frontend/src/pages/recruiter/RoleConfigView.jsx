import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

const FILTERS = ['All', 'Full-time', 'Internship', 'Contract', 'Part-time'];

const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14C11 11 13 8.82843 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 8.82843 5 11 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13C1 10.5 3.5 9 6 9C8.5 9 11 10.5 11 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 7C12.5 7 14 8 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
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

  const filtered = filter === 'All' ? jobs : jobs.filter((job) => job.employment_type === filter);
  const totalApplicants = jobs.reduce((sum, job) => sum + (job.application_count || 0), 0);
  const totalShortlisted = jobs.reduce((sum, job) => sum + (job.shortlisted_count || 0), 0);

  return (
    <div className="page-shell mx-auto flex w-full max-w-6xl flex-col gap-8 p-4 md:p-8 animate-fade-in-up">
      <div className="surface-divider flex flex-col gap-4 border-b pb-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Recruiter Portal</p>
          <h1 className="page-heading font-display text-3xl tracking-tight">Jobs & Roles</h1>
          <p className="page-copy max-w-2xl text-sm">
            Keep listings polished, monitor applicant demand, and move the strongest roles into review quickly.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/recruiter/create-job')}>
          Post New Job
        </Button>
      </div>

      {/* Subtle inline stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 -mt-4">
        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">{jobs.length}</span>
          active roles
        </span>
        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-display text-lg font-semibold text-accent">{totalApplicants}</span>
          total applicants
        </span>
        {totalShortlisted > 0 && (
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-display text-lg font-semibold text-emerald-500">{totalShortlisted}</span>
            shortlisted
          </span>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {FILTERS.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setFilter(entry)}
            className={`rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] transition ${
              filter === entry
                ? 'border-slate-950 bg-slate-950 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-950'
                : 'surface-card page-copy hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {entry}
          </button>
        ))}
      </div>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-label="Role listings">
        {loading && <p className="page-copy">Loading roles...</p>}
        {!loading && filtered.length === 0 && <p className="page-copy">No roles match the current filter.</p>}

        {!loading && filtered.map((job) => {
          const brand = getCompanyBranding(job.company);
          return (
            <article
              key={job.id}
              className="surface-card flex flex-col rounded-3xl p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  <CompanyLogo company={job.company} className="shrink-0" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">{brand.name}</p>
                      <span className="surface-pill rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                        {brand.industry}
                      </span>
                    </div>
                    <h3 className="page-heading mt-2 font-display text-xl">{job.title}</h3>
                    <p className="page-copy mt-2 text-sm">{makeExcerpt(job.description || brand.headline, 145)}</p>
                  </div>
                </div>
                <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider font-semibold ${job.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {job.is_active ? 'Active' : 'Closed'}
                </span>
              </div>

              <div className="page-copy mt-4 flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5"><MapPinIcon /> {job.location || 'Location flexible'}</span>
                <span className="flex items-center gap-1.5"><ClockIcon /> {job.employment_type || 'Not specified'}</span>
                <span className="flex items-center gap-1.5"><UsersIcon /> {job.application_count || 0} applicants{job.shortlisted_count > 0 ? ` · ${job.shortlisted_count} shortlisted` : ''}</span>
              </div>

              <div className="surface-divider mt-6 flex items-center justify-end border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter/ranking-board?jobId=${job.id}`)}>
                  View Applicants
                </Button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
