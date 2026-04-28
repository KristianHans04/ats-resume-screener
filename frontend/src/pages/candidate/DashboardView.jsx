import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding } from '../../data/companyBranding';

const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FolderIcon = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 12C6 10.9 6.9 10 8 10H20L24 14H40C41.1 14 42 14.9 42 16V36C42 37.1 41.1 38 40 38H8C6.9 38 6 37.1 6 36V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export default function DashboardView() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsData, jobsData] = await Promise.all([
          apiFetch('/jobs/applications/'),
          apiFetch('/jobs/jobs/'),
        ]);
        setApplications(appsData);
        setRecommendedJobs(jobsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const { activeApps, awaitingInquiry, reviewedApps } = useMemo(() => {
    const active = applications.filter((a) => !['REJECTED', 'WITHDRAWN'].includes(a.status));
    const inquiry = active.filter((a) => a.status === 'AWAITING_INQUIRY');
    const reviewed = applications.filter((a) => ['SCORED', 'COMPLETED', 'SHORTLISTED'].includes(a.status));
    return { activeApps: active, awaitingInquiry: inquiry, reviewedApps: reviewed };
  }, [applications]);

  return (
    <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="surface-divider border-b pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Candidate Portal</p>
              <h1 className="page-heading font-display text-3xl tracking-tight md:text-4xl">My Applications</h1>
              <p className="page-copy text-sm">Track active roles, respond to follow-up inquiries, and keep your job search organized.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" size="md" icon={PlusIcon} onClick={() => navigate('/candidate/apply')}>
                Browse roles
              </Button>
            </div>
          </div>

          {/* Subtle inline stats */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">{activeApps.length}</span>
              active
            </span>
            {awaitingInquiry.length > 0 && (
              <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="font-display text-lg font-semibold text-amber-500">{awaitingInquiry.length}</span>
                awaiting action
              </span>
            )}
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-display text-lg font-semibold text-emerald-500">{reviewedApps.length}</span>
              reviewed
            </span>
          </div>
        </header>

        {awaitingInquiry.length > 0 && (
          <section className="surface-card rounded-[24px] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <CompanyLogo company={awaitingInquiry[0].company_name} />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">Action required</p>
                  <h2 className="mt-2 font-display text-2xl tracking-tight text-slate-950 dark:text-white">
                    Follow-up questions are waiting for your response.
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Continue the application for {awaitingInquiry[0].job_title} at {awaitingInquiry[0].company_name} to complete the evaluation workflow.
                  </p>
                </div>
              </div>
              <Button variant="primary" size="md" onClick={() => navigate(`/candidate/inquiry/${awaitingInquiry[0].id}`)}>
                Continue inquiry
              </Button>
            </div>
          </section>
        )}

        <section aria-label="Application overview" className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="page-label font-mono text-xs uppercase tracking-widest">Active roles</h2>
              <span className="surface-pill rounded-full px-3 py-0.5 font-mono text-xs">{activeApps.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {loading && [1, 2].map((item) => <ApplicationCard key={item} loading />)}

              {!loading && activeApps.length === 0 && (
                <div className="surface-subtle col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed p-16 text-center">
                  <FolderIcon className="page-label mb-4 h-12 w-12" />
                  <p className="page-heading mb-2 font-display text-lg">No active applications</p>
                  <p className="page-copy mb-6 max-w-xs text-sm">Apply for a role to begin the evaluation and inquiry process.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/candidate/apply')}>
                    Explore opportunities
                  </Button>
                </div>
              )}

              {!loading && activeApps.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewInquiry={() => navigate(`/candidate/inquiry/${application.id}`)}
                  onViewSummary={() => navigate(`/candidate/history/${application.id}`)}
                />
              ))}
            </div>
          </div>

          {/* Recommended Jobs sidebar */}
          <aside className="stat-card h-fit p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl tracking-tight text-slate-950 dark:text-white">Recommended Jobs</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/apply')}>See all</Button>
            </div>
            <div className="mt-5 space-y-3">
              {loading && (
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">Loading opportunities…</p>
              )}
              {!loading && recommendedJobs.length === 0 && (
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  New job listings will appear here.
                </p>
              )}
              {!loading && recommendedJobs.map((job) => {
                const brand = getCompanyBranding(job.company);
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => navigate(`/candidate/apply/${job.id}`)}
                    className="surface-subtle flex w-full items-start gap-3 rounded-2xl p-3.5 text-left transition-colors hover:border-slate-400/40"
                  >
                    <CompanyLogo company={job.company} compact className="shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{job.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{brand.name}</p>
                      <span className="mt-1.5 inline-block rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-accent">
                        {job.employment_type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
