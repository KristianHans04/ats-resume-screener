import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

function formatAverageScore(value) {
  if (value === null || value === undefined) return 'Pending';
  return `${Math.round(value)} / 100`;
}

export default function CommandCenterView() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const data = await apiFetch('/jobs/jobs/');
        setRoles(data);
      } catch (err) {
        console.error('Error fetching roles', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRoles();
  }, []);

  const totalApplicants = roles.reduce((sum, role) => sum + (role.application_count || 0), 0);
  const totalShortlisted = roles.reduce((sum, role) => sum + (role.shortlisted_count || 0), 0);
  const activeRoles = roles.filter((role) => role.is_active).length;
  const avgScorePool = roles
    .map((role) => role.avg_ai_score)
    .filter((score) => typeof score === 'number');
  const averageScore = avgScorePool.length
    ? Math.round(avgScorePool.reduce((sum, score) => sum + score, 0) / avgScorePool.length)
    : null;

  const priorityRoles = [...roles]
    .sort((a, b) => (b.application_count || 0) - (a.application_count || 0))
    .slice(0, 3);

  return (
    <div className="page-shell mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8 animate-fade-in-up">
      <div className="surface-divider flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Recruiter Portal</p>
          <h1 className="page-heading font-display text-3xl tracking-tight md:text-4xl">Command Centre</h1>
          <p className="page-copy max-w-2xl text-sm">
            Review active hiring pipelines, monitor applicant flow, and keep priority roles moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/recruiter/roles')}>
            Manage Roles
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/recruiter/create-job')}>
            Post New Job
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Hiring overview">
        {[
          { label: 'Active Roles', value: activeRoles, hint: `${roles.length} total listings` },
          { label: 'Applications', value: totalApplicants, hint: `${totalShortlisted} shortlisted` },
          { label: 'Avg AI Score', value: averageScore === null ? 'Pending' : `${averageScore} / 100`, hint: 'Across reviewed roles' },
          { label: 'Priority Roles', value: priorityRoles.length, hint: 'Highest applicant volume' },
        ].map((stat) => (
          <article key={stat.label} className="stat-card rounded-2xl p-5">
            <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">{stat.label}</p>
            <p className="page-heading mt-4 font-display text-3xl">{stat.value}</p>
            <p className="page-copy mt-2 text-sm">{stat.hint}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_340px]">
        <section aria-label="Active roles" className="glass-card rounded-3xl shadow-sm">
          <div className="surface-divider flex flex-col gap-3 border-b px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">Open Roles</p>
              <h2 className="page-heading mt-2 font-display text-xl">Current hiring pipeline</h2>
            </div>
            <p className="page-copy text-sm">{loading ? 'Loading roles…' : `${roles.length} roles synced from the hiring workspace`}</p>
          </div>

          <div className="divide-y divide-slate-200/80 dark:divide-slate-800/80">
            {loading && <div className="page-copy p-8 text-center">Loading roles...</div>}
            {!loading && roles.length === 0 && (
              <div className="page-copy p-8 text-center">No active roles found. Post a new job to start receiving applications.</div>
            )}

            {!loading && roles.map((role) => {
              const brand = getCompanyBranding(role.company);
              return (
                <article key={role.id} className="grid gap-5 px-6 py-5 lg:grid-cols-[minmax(0,1fr)_120px_120px_140px_auto] lg:items-center">
                  <div className="flex min-w-0 gap-4">
                    <CompanyLogo company={role.company} compact className="shrink-0" />
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="page-heading truncate font-display text-lg">{role.title}</h3>
                        <span className="surface-pill rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                          {brand.industry}
                        </span>
                      </div>
                      <p className="page-copy text-sm">{makeExcerpt(role.description || brand.headline, 120)}</p>
                      <div className="page-copy flex flex-wrap gap-3 text-xs">
                        <span>{brand.name}</span>
                        <span>{role.location || 'Location flexible'}</span>
                        <span>{role.employment_type || 'Role type not set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Applicants</p>
                    <p className="page-heading text-lg">{role.application_count || 0}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Shortlisted</p>
                    <p className="page-heading text-lg">{role.shortlisted_count || 0}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Avg Score</p>
                    <p className="page-heading text-lg">{formatAverageScore(role.avg_ai_score)}</p>
                  </div>

                  <div className="flex items-center justify-start gap-3 lg:justify-end">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                      role.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${role.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {role.is_active ? 'Accepting' : 'Closed'}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter/ranking-board?jobId=${role.id}`)}>
                      View Rankings
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="space-y-5">
          <section className="surface-card rounded-3xl p-6">
            <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">Priority Watchlist</p>
            <div className="mt-4 space-y-4">
              {priorityRoles.length === 0 && <p className="page-copy text-sm">Post roles to populate the watchlist.</p>}
              {priorityRoles.map((role) => {
                const brand = getCompanyBranding(role.company);
                return (
                  <div key={role.id} className="surface-subtle rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <CompanyLogo company={role.company} compact className="shrink-0" />
                      <div className="min-w-0">
                        <p className="page-heading truncate text-sm font-semibold">{role.title}</p>
                        <p className="page-copy mt-1 text-xs">{brand.name}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="page-copy">{role.application_count || 0} applicants</span>
                      <span className="page-copy">{role.shortlisted_count || 0} shortlisted</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card rounded-3xl p-6">
            <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">Operating Notes</p>
            <div className="mt-4 space-y-3 text-sm">
              <p className="page-copy">The sidebar remains fixed in its existing brand palette across both themes.</p>
              <p className="page-copy">Main content surfaces now use neutral contrast so role data stays readable in light and dark mode.</p>
              <p className="page-copy">Official company logos are loaded from local assets for seeded recruiter roles.</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
