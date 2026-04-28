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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await apiFetch('/jobs/applications/');
        setApplications(data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const { activeApps, awaitingInquiry, reviewedApps, recentApps } = useMemo(() => {
    const active = applications.filter((application) => !['REJECTED', 'WITHDRAWN'].includes(application.status));
    const inquiry = active.filter((application) => application.status === 'AWAITING_INQUIRY');
    const reviewed = applications.filter((application) => ['SCORED', 'COMPLETED', 'SHORTLISTED'].includes(application.status));

    return {
      activeApps: active,
      awaitingInquiry: inquiry,
      reviewedApps: reviewed,
      recentApps: applications.slice(0, 4),
    };
  }, [applications]);

  return (
    <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="surface-divider flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Candidate Portal</p>
            <h1 className="page-heading font-display text-3xl tracking-tight md:text-4xl">My Applications</h1>
            <p className="page-copy text-sm">Track active roles, respond to follow-up inquiries, and keep your job search organized.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" icon={PlusIcon} onClick={() => navigate('/candidate/apply')}>
              Browse roles
            </Button>
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

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['Active applications', activeApps.length, 'Roles currently in progress'],
            ['Needs your action', awaitingInquiry.length, 'Applications waiting for extra context'],
            ['Reviewed recently', reviewedApps.length, 'Roles that have reached scoring or review'],
          ].map(([label, value, copy]) => (
            <div key={label} className="stat-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
              <p className="mt-3 font-display text-4xl tracking-tight text-slate-950 dark:text-white">{value}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p>
            </div>
          ))}
        </section>

        <section aria-label="Application overview" className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="page-label font-mono text-xs uppercase tracking-widest">Active roles</h2>
              <span className="surface-pill rounded-full px-3 py-0.5 font-mono text-xs">{activeApps.length}</span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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

          <aside className="stat-card h-fit p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl tracking-tight text-slate-950 dark:text-white">Recent activity</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/candidate/history')}>History</Button>
            </div>
            <div className="mt-5 space-y-4">
              {recentApps.length === 0 && (
                <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Your latest submissions and status updates will appear here.
                </p>
              )}

              {recentApps.map((application) => {
                const brand = getCompanyBranding(application.company_name);

                return (
                  <button
                    key={application.id}
                    type="button"
                    onClick={() => navigate(`/candidate/history/${application.id}`)}
                    className="surface-subtle flex w-full items-start gap-3 rounded-2xl p-4 text-left transition-colors hover:border-slate-400/40"
                  >
                    <CompanyLogo company={application.company_name} compact className="shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{application.job_title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{brand.name}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{application.status.replace(/_/g, ' ')}</p>
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
