import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

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

  const totalApplicants = roles.reduce((sum, r) => sum + (r.application_count || 0), 0);
  const totalShortlisted = roles.reduce((sum, r) => sum + (r.shortlisted_count || 0), 0);
  const activeRoles = roles.filter(r => r.is_active).length;

  return (
    <div className="page-shell mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="surface-divider flex flex-col gap-4 border-b pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Recruiter Portal</p>
          <h1 className="page-heading font-display text-3xl tracking-tight md:text-4xl">Command Centre</h1>
          <p className="page-copy max-w-2xl text-sm">
            Review active hiring pipelines, monitor applicant flow, and keep priority roles moving.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/recruiter/role-config')}>
            Manage Roles
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/recruiter/create-job')}>
            Post New Job
          </Button>
        </div>
      </div>

      {/* Subtle inline stats */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 -mt-4">
        <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">{activeRoles}</span>
          active roles
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

      {/* Roles list */}
      <section aria-label="Active roles" className="glass-card rounded-3xl shadow-sm">
        <div className="surface-divider flex flex-col gap-3 border-b px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">Open Roles</p>
            <h2 className="page-heading mt-1 font-display text-xl">Current hiring pipeline</h2>
          </div>
          <p className="page-copy text-sm">{loading ? 'Loading…' : `${roles.length} roles in workspace`}</p>
        </div>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-4 px-6 py-3 border-b surface-divider">
          <div className="w-9" />
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Role</p>
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em] text-right">Actions</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading && <div className="page-copy p-8 text-center">Loading roles...</div>}
          {!loading && roles.length === 0 && (
            <div className="page-copy p-8 text-center">No roles found. Post a new job to start receiving applications.</div>
          )}

          {!loading && roles.map((role) => {
            const brand = getCompanyBranding(role.company);
            return (
              <article
                key={role.id}
                className="grid grid-cols-[auto_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Logo */}
                <CompanyLogo company={role.company} compact className="shrink-0" />

                {/* Title + description + meta */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <h3 className="page-heading font-display text-sm font-semibold">{role.title}</h3>
                    <span className="page-copy font-mono text-[10px]">{brand.name}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="page-copy text-xs">{role.location || 'Flexible'}</span>
                    {role.employment_type && <span className="page-copy text-xs">{role.employment_type}</span>}
                    <span className={`font-mono text-[10px] uppercase tracking-wider font-semibold ${role.is_active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                      {role.is_active ? 'Accepting' : 'Closed'}
                    </span>
                    {role.application_count > 0 && (
                      <span className="page-copy text-xs">{role.application_count} applicant{role.application_count !== 1 ? 's' : ''}</span>
                    )}
                    {role.shortlisted_count > 0 && (
                      <span className="page-copy text-xs text-emerald-600 dark:text-emerald-400">{role.shortlisted_count} shortlisted</span>
                    )}
                    {role.avg_ai_score !== null && role.avg_ai_score !== undefined && (
                      <span className="page-copy text-xs tabular-nums">avg {Math.round(role.avg_ai_score)}%</span>
                    )}
                  </div>
                </div>

                {/* Action */}
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => navigate(`/recruiter/ranking-board?jobId=${role.id}`)}
                >
                  View Applicants
                </Button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
