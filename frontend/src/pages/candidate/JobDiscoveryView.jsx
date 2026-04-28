import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { extractRequirementTags, getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

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

export default function JobDiscoveryView() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 6;

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await apiFetch('/jobs/jobs/');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const employmentOptions = useMemo(
    () => ['All', ...new Set(jobs.map((job) => job.employment_type).filter(Boolean))],
    [jobs],
  );

  const locationOptions = useMemo(
    () => ['All', ...new Set(jobs.map((job) => job.location).filter(Boolean))],
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch = !query || [job.title, job.company, job.location, job.department, job.description]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
      const matchesEmployment = employmentFilter === 'All' || job.employment_type === employmentFilter;
      const matchesLocation = locationFilter === 'All' || job.location === locationFilter;

      return matchesSearch && matchesEmployment && matchesLocation;
    });
  }, [jobs, search, employmentFilter, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, employmentFilter, locationFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="surface-divider flex flex-col gap-2 border-b pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Career Portal</p>
          <h1 className="page-heading font-display text-3xl tracking-tight md:text-4xl">Open Roles</h1>
          <p className="page-copy text-sm">Search, filter, and review live opportunities before starting an application.</p>
        </div>

        <section className="surface-card rounded-[24px] p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.55fr_0.55fr_auto]">
            <label className="flex flex-col gap-2">
              <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Search roles</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="input-field h-11 px-4 text-sm"
                placeholder="Search by title, company, location, or skill"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Work type</span>
              <select value={employmentFilter} onChange={(event) => setEmploymentFilter(event.target.value)} className="input-field h-11 px-4 text-sm">
                {employmentOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="input-label font-mono text-[11px] uppercase tracking-[0.18em]">Location</span>
              <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className="input-field h-11 px-4 text-sm">
                {locationOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <div className="flex items-end">
              <div className="surface-subtle w-full rounded-2xl px-4 py-3 text-center">
                <p className="font-display text-2xl text-slate-950 dark:text-white">{filteredJobs.length}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Matching roles</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {loading && <p className="page-copy">Loading open roles...</p>}
          {!loading && filteredJobs.length === 0 && <p className="page-copy">No open roles match the current filters.</p>}
          {!loading && paginatedJobs.map((role) => {
            const brand = getCompanyBranding(role.company);
            const tags = extractRequirementTags(role.requirements);

            return (
              <div
                key={role.id}
                className="surface-card group flex cursor-pointer flex-col rounded-[24px] p-6 transition-all hover:border-slate-400/40 hover:shadow-xl"
                onClick={() => navigate(`/candidate/apply/${role.id}`)}
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <CompanyLogo company={role.company} className="shrink-0" />
                    <div className="min-w-0">
                      <p className="page-label mb-1 font-mono text-[10px] uppercase tracking-widest">{role.company}</p>
                      <h3 className="page-heading font-display text-xl transition-colors group-hover:text-slate-700 dark:group-hover:text-slate-100">{role.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{brand.headline}</p>
                    </div>
                  </div>

                  {role.application_status ? (
                    <span className={`rounded-md border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${
                      role.application_status === 'COMPLETED' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                        : role.application_status === 'FAILED' ? 'border-red-500/20 bg-red-500/10 text-red-400'
                        : 'border-orange-500/20 bg-orange-500/10 text-orange-400'
                    }`}>
                      {role.application_status.replace(/_/g, ' ')}
                    </span>
                  ) : (
                    <span className="rounded-md border border-accent/20 bg-accent/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                      Open
                    </span>
                  )}
                </div>

                <div className="page-copy mb-5 flex flex-wrap items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5"><MapPinIcon /> {role.location}</span>
                  <span className="flex items-center gap-1.5"><ClockIcon /> {role.employment_type}</span>
                  {role.salary && <span className="surface-pill rounded-full px-2.5 py-1 text-[11px] font-medium">{role.salary}</span>}
                </div>

                <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {makeExcerpt(role.description, 164)}
                </p>

                {tags.length > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="surface-pill rounded-full px-3 py-1 text-[11px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="surface-divider mt-auto flex items-center justify-between border-t pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    {brand.industry}
                  </p>
                  <Button
                    variant={role.application_status ? 'primary' : 'outline'}
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (role.application_status === 'AWAITING_INQUIRY') {
                        navigate(`/candidate/inquiry/${role.application_id}`);
                      } else if (role.application_status) {
                        navigate(`/candidate/history/${role.application_id}`);
                      } else {
                        navigate(`/candidate/apply/${role.id}`);
                      }
                    }}
                  >
                    {role.application_status
                      ? role.application_status === 'AWAITING_INQUIRY' ? 'Continue application' : 'View status'
                      : 'View role'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && filteredJobs.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredJobs.length)} of {filteredJobs.length} roles
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" isDisabled={page === 1} onClick={() => setPage((currentPage) => currentPage - 1)}>
                Previous
              </Button>
              <span className="surface-pill rounded-full px-3 py-1 text-xs font-medium">
                Page {page} of {totalPages}
              </span>
              <Button variant="outline" size="sm" isDisabled={page === totalPages} onClick={() => setPage((currentPage) => currentPage + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
