import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import StatusChip from '../../components/ui/StatusChip';
import CompanyLogo from '../../components/ui/CompanyLogo';
import Button from '../../components/ui/Button';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

const getTier = (status) => {
  if (status === 'SHORTLISTED') return 0;
  if (status === 'COMPLETED' || status === 'SCORED') return 1;
  if (status === 'AWAITING_INQUIRY') return 2;
  if (status === 'REJECTED') return 4;
  return 3;
};

function getInitials(name) {
  return (name || '?').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function RankingBoardView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appsData, jobData] = await Promise.all([
          apiFetch(jobId ? `/jobs/jobs/${jobId}/applications/` : '/jobs/applications/'),
          jobId ? apiFetch(`/jobs/jobs/${jobId}/`) : Promise.resolve(null),
        ]);
        setApplications(appsData);
        setJob(jobData);
      } catch (err) {
        console.error('Failed to fetch applicant pipeline', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [jobId]);

  const sortedCandidates = [...applications].map(app => ({
    id: app.id,
    name: app.full_name || app.candidate_username || 'Unknown',
    email: app.email || '',
    phone: app.phone || '',
    appliedDate: app.created_at,
    finalScore: app.final_score || app.ai_score || app.resume_score || 0,
    status: app.status,
    classification: app.classification,
  })).sort((a, b) => {
    const tierDiff = getTier(a.status) - getTier(b.status);
    if (tierDiff !== 0) return tierDiff;
    return b.finalScore - a.finalScore;
  });

  const brand = job ? getCompanyBranding(job.company) : null;

  const shortlisted = sortedCandidates.filter(c => c.status === 'SHORTLISTED').length;
  const pending = sortedCandidates.filter(c => c.status === 'AWAITING_INQUIRY').length;
  const rejected = sortedCandidates.filter(c => c.status === 'REJECTED').length;

  return (
    <div className="page-shell flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">

      {/* Job header */}
      <div className="surface-divider border-b pb-6">
        <Button variant="ghost" size="sm" className="-ml-3 mb-4 self-start" onClick={() => navigate(-1)}>
          ← Back
        </Button>

        {job ? (
          <div className="flex items-start gap-4">
            <CompanyLogo company={job.company} className="shrink-0 mt-1" />
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent mb-1">{brand?.name}</p>
              <h1 className="page-heading font-display text-3xl tracking-tight">{job.title}</h1>
              <p className="page-copy text-sm mt-2 max-w-2xl">{makeExcerpt(job.description, 200)}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {job.location && <span className="page-copy text-xs">📍 {job.location}</span>}
                {job.employment_type && <span className="page-copy text-xs">⏱ {job.employment_type}</span>}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  job.is_active
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${job.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {job.is_active ? 'Accepting applications' : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="page-heading font-display text-3xl tracking-tight">Applicant Pipeline</h1>
            <p className="page-copy text-sm mt-1">All applications across active roles.</p>
          </div>
        )}

        {/* Inline stats */}
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-display text-lg font-semibold text-slate-900 dark:text-white">{sortedCandidates.length}</span>
            total
          </span>
          {shortlisted > 0 && (
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-display text-lg font-semibold text-emerald-500">{shortlisted}</span>
              shortlisted
            </span>
          )}
          {pending > 0 && (
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-display text-lg font-semibold text-amber-500">{pending}</span>
              pending review
            </span>
          )}
          {rejected > 0 && (
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-display text-lg font-semibold text-red-400">{rejected}</span>
              rejected
            </span>
          )}
        </div>
      </div>

      {/* Applicant sheet */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
        {/* Column headers */}
        <div className="hidden sm:grid sm:grid-cols-[2.5rem_1fr_140px_110px_72px] gap-4 px-5 py-3 border-b surface-divider">
          <div />
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Candidate</p>
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Applied</p>
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Status</p>
          <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em] text-right">Score</p>
        </div>

        {loading && <div className="page-copy p-10 text-center">Loading applicants…</div>}
        {!loading && sortedCandidates.length === 0 && (
          <div className="page-copy p-10 text-center">No applicants yet for this role.</div>
        )}

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {sortedCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="grid grid-cols-[2.5rem_1fr_auto] sm:grid-cols-[2.5rem_1fr_140px_110px_72px] gap-4 px-5 py-4 items-center cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.03] group"
              onClick={() => navigate(`/recruiter/profiles/${candidate.id}`)}
            >
              {/* Initials badge */}
              <div className="h-9 w-9 rounded-full surface-subtle border flex items-center justify-center font-mono text-[10px] font-bold page-label shrink-0 group-hover:border-accent/40 transition-colors">
                {getInitials(candidate.name)}
              </div>

              {/* Name + contact */}
              <div className="min-w-0">
                <p className="page-heading text-sm font-semibold truncate group-hover:text-accent transition-colors">{candidate.name}</p>
                <p className="page-copy font-mono text-[10px] truncate mt-0.5">{candidate.email || candidate.phone || '—'}</p>
              </div>

              {/* Applied date — hidden on mobile */}
              <p className="page-copy text-xs hidden sm:block">{formatDate(candidate.appliedDate)}</p>

              {/* Status */}
              <div className="hidden sm:block">
                <StatusChip status={candidate.status} size="sm" />
              </div>

              {/* Score */}
              <p className={`page-heading font-mono text-sm font-semibold text-right tabular-nums ${
                candidate.finalScore >= 70 ? 'text-emerald-500' : candidate.finalScore >= 40 ? 'text-amber-500' : 'text-slate-400'
              }`}>
                {candidate.finalScore > 0 ? `${Math.round(candidate.finalScore)}%` : '—'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
