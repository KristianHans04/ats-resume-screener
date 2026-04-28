import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14C11 11 13 8.82843 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 8.82843 5 11 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5">
    <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 13C1 10.5 3.5 9 6 9C8.5 9 11 10.5 11 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 7C12.5 7 14 8 14 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="11.5" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

function PaginationControls({ page, totalPages, pageSize, totalItems, onPrevious, onNext }) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return (
    <div className="surface-card flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="page-copy text-sm">Showing {start}–{end} of {totalItems} roles</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" isDisabled={page === 1} onClick={onPrevious}>Previous</Button>
        <span className="surface-pill rounded-full px-3 py-1 text-xs font-medium">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" isDisabled={page === totalPages} onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}

const PAGE_SIZE = 8;

export default function RoleConfigView() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

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

  const employmentOptions = useMemo(
    () => ['All', ...new Set(jobs.map(j => j.employment_type).filter(Boolean))],
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter(job => {
      const matchesSearch = !query || [job.title, job.company, job.location, job.department, job.description]
        .filter(Boolean).some(v => v.toLowerCase().includes(query));
      const matchesEmployment = employmentFilter === 'All' || job.employment_type === employmentFilter;
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && job.is_active) ||
        (statusFilter === 'Closed' && !job.is_active);
      return matchesSearch && matchesEmployment && matchesStatus;
    });
  }, [jobs, search, employmentFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, employmentFilter, statusFilter]);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const totalApplicants = jobs.reduce((s, j) => s + (j.application_count || 0), 0);
  const totalShortlisted = jobs.reduce((s, j) => s + (j.shortlisted_count || 0), 0);

  return (
    <div className="page-shell mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8 animate-fade-in-up">

      {/* Header */}
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
          roles
        </span>
        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-display text-lg font-semibold text-accent">{totalApplicants}</span>
          applicants
        </span>
        {totalShortlisted > 0 && (
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-display text-lg font-semibold text-emerald-500">{totalShortlisted}</span>
            shortlisted
          </span>
        )}
      </div>

      {/* Filters */}
      <section className="surface-card rounded-[24px] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_0.5fr_0.5fr]">
          <label className="flex flex-col gap-2">
            <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Search roles</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field h-11 px-4 text-sm"
              placeholder="Title, company, location…"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Work type</span>
            <select value={employmentFilter} onChange={e => setEmploymentFilter(e.target.value)} className="input-field h-11 px-4 text-sm">
              {employmentOptions.map(o => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Status</span>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field h-11 px-4 text-sm">
              {['All', 'Active', 'Closed'].map(o => <option key={o}>{o}</option>)}
            </select>
          </label>
        </div>
      </section>

      {/* Pagination (top) */}
      {!loading && filteredJobs.length > PAGE_SIZE && (
        <PaginationControls
          page={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalItems={filteredJobs.length}
          onPrevious={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        />
      )}

      {/* Cards grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Role listings">
        {loading && <p className="page-copy col-span-full">Loading roles...</p>}
        {!loading && filteredJobs.length === 0 && <p className="page-copy col-span-full">No roles match the current filters.</p>}

        {!loading && paginatedJobs.map(job => {
          const brand = getCompanyBranding(job.company);
          return (
            <article
              key={job.id}
              className="surface-card group flex flex-col rounded-[20px] p-4 transition-all hover:border-slate-400/40 hover:shadow-xl"
            >
              {/* Logo + company + status row */}
              <div className="mb-3 flex items-start gap-2.5">
                <CompanyLogo company={job.company} compact className="shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <p className="page-label font-mono text-[9px] uppercase tracking-widest truncate">{brand.name}</p>
                    <span className={`font-mono text-[9px] uppercase tracking-widest font-semibold ${
                      job.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}>
                      {job.is_active ? 'Active' : 'Closed'}
                    </span>
                  </div>
                  <h3 className="page-heading font-display text-sm leading-snug line-clamp-2">{job.title}</h3>
                </div>
              </div>

              {/* Location + type */}
              <div className="page-copy mb-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><MapPinIcon /> {job.location || 'Flexible'}</span>
                <span className="flex items-center gap-1"><ClockIcon /> {job.employment_type || 'Not set'}</span>
              </div>

              {/* Description excerpt */}
              <p className="mb-3 text-xs leading-5 text-slate-600 dark:text-slate-300 line-clamp-3">
                {makeExcerpt(job.description || brand.headline, 120)}
              </p>

              {/* Footer */}
              <div className="surface-divider mt-auto flex items-center justify-between border-t pt-3">
                <span className="flex items-center gap-1 page-copy text-[9px] uppercase font-mono tracking-widest">
                  <UsersIcon />
                  {job.application_count || 0}{job.shortlisted_count > 0 ? ` · ${job.shortlisted_count} ✓` : ''}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/recruiter/ranking-board?jobId=${job.id}`)}
                >
                  View
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Pagination (bottom) */}
      {!loading && filteredJobs.length > PAGE_SIZE && (
        <PaginationControls
          page={page} totalPages={totalPages} pageSize={PAGE_SIZE} totalItems={filteredJobs.length}
          onPrevious={() => setPage(p => p - 1)} onNext={() => setPage(p => p + 1)}
        />
      )}
    </div>
  );
}
