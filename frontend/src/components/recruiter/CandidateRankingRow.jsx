import React from 'react';
import StatusChip from '../ui/StatusChip';
import ProgressBar from '../ui/ProgressBar';
import Button from '../ui/Button';

/* ── Inline SVG icons ────────────────────────────────────── */
const CalendarIcon = () => (
  <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60">
    <rect x="1" y="2" width="9" height="8" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M1 4.5H10" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M3.5 1V3M7.5 1V3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

const RoleIcon = () => (
  <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60">
    <rect x="1" y="3" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M3.5 3V2C3.5 1.45 3.95 1 4.5 1H6.5C7.05 1 7.5 1.45 7.5 2V3" stroke="currentColor" strokeWidth="1.1"/>
  </svg>
);

const ProfileIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
    <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M2 12C2 10 4.24 8.5 7 8.5C9.76 8.5 12 10 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

/* ── Format helpers ──────────────────────────────────────── */
function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}

function normalise(val) {
  if (!val && val !== 0) return 0;
  return val <= 1 && !Number.isInteger(val) ? Math.round(val * 100) : Math.round(val);
}

function formatScore(val) {
  if (!val && val !== 0) return '—';
  const n = parseFloat(val);
  return n <= 1 && !Number.isInteger(n) ? n.toFixed(2) : `${Math.round(n)}%`;
}

/* ── Row skeleton ─────────────────────────────────────────── */
function RankingRowSkeleton() {
  return (
    <div className="surface-subtle grid grid-cols-[48px_1fr_200px_120px_auto] items-center gap-4 rounded-xl p-4 px-5 animate-pulse">
      <div className="h-6 w-6 rounded bg-slate-200 dark:bg-white/10 mx-auto" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10" />
        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="h-6 w-24 rounded-full bg-slate-200 dark:bg-white/10" />
      <div className="ml-auto h-8 w-20 rounded-md bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

/* ── Header row ──────────────────────────────────────────── */
function RankingRowHeader() {
  return (
    <div className="surface-divider hidden select-none grid-cols-[48px_1fr_200px_120px_auto] gap-4 border-b px-5 py-2 mb-2 md:grid">
      <span className="page-label text-center font-mono text-[10px] tracking-widest uppercase">#</span>
      <span className="page-label font-mono text-[10px] tracking-widest uppercase">Candidate</span>
      <span className="page-label font-mono text-[10px] tracking-widest uppercase">Score Breakdown</span>
      <span className="page-label font-mono text-[10px] tracking-widest uppercase">Status</span>
      <span className="page-label text-right font-mono text-[10px] tracking-widest uppercase">Action</span>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */
function CandidateRankingRow({
  candidate = {},
  rank = 0,
  onViewProfile,
  selected = false,
  loading = false,
}) {
  if (loading) return <RankingRowSkeleton rank={rank} />;

  const {
    id, name = 'Unknown Candidate', email = '', phone = '',
    appliedRole = '—', appliedDate,
    resumeScore = 0, responseScore = 0, finalScore = 0,
    status = 'under-review', inquiryComplete = false,
  } = candidate;

  const rsNorm = normalise(resumeScore);
  const rqNorm = normalise(responseScore);
  
  // Podium Logic
  const podiumStyles = rank === 1 ? 'border-l-[3px] border-l-cyan-400' :
                       rank === 2 ? 'border-l-[3px] border-l-cyan-500' :
                       rank === 3 ? 'border-l-[3px] border-l-cyan-600' : '';

  const podiumText = rank === 1 ? 'text-cyan-400 font-bold' :
                     rank === 2 ? 'text-cyan-500 font-bold' :
                     rank === 3 ? 'text-cyan-600 font-bold' : 'page-label font-medium';

  return (
    <div
      className={`surface-subtle grid grid-cols-1 md:grid-cols-[48px_1fr_200_120px_auto] items-center gap-4 rounded-xl p-4 px-5 transition-all duration-200
        hover:border-accent/30 hover:translate-x-0.5
        ${selected ? 'border-accent bg-accent/10 shadow-sm' : ''}
        ${status === 'rejected' ? 'opacity-50' : ''}
        ${podiumStyles}
      `}
      role="row"
    >
      {/* 1. Rank */}
      <div className="hidden md:flex items-center justify-center font-mono text-lg tabular-nums leading-none">
        <span className={podiumText}>{rank}</span>
      </div>

      {/* 2. Candidate Info */}
      <div className="flex flex-col min-w-0">
        <p className="page-heading text-base font-semibold truncate">{name}</p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          {email && <span className="page-label font-mono text-[10px] tracking-wider">{email}</span>}
          {phone && <><span className="page-label">·</span><span className="page-label font-mono text-[10px] tracking-wider">{phone}</span></>}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className="page-label flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider"><RoleIcon /> {appliedRole}</span>
          <span className="page-label">·</span>
          <span className="page-label flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider"><CalendarIcon /> {formatDate(appliedDate)}</span>
          {inquiryComplete && (
            <>
              <span className="page-label">·</span>
              <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-wider">Inquiry Complete</span>
            </>
          )}
        </div>
      </div>

      {/* 3. Scores */}
      <div className="flex flex-col gap-2">
        <ProgressBar value={rsNorm} label="Resume" variant="default" size="xs" showValue threshold thresholdValue={60} thresholdBelow />
        {inquiryComplete && (
          <ProgressBar value={rqNorm} label="Response" variant="semantic" size="xs" showValue />
        )}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-base font-medium text-accent tabular-nums leading-none">{formatScore(finalScore)}</span>
          <span className="page-label font-mono text-[10px] tracking-widest uppercase">S_final</span>
        </div>
      </div>

      {/* 4. Status */}
      <div className="flex justify-start">
        <StatusChip status={status} size="sm" />
      </div>

      {/* 5. Action */}
      <div className="flex justify-end">
        <Button variant={selected ? 'secondary' : 'outline'} size="sm" icon={ProfileIcon} onClick={() => onViewProfile?.(id)}>
          Profile
        </Button>
      </div>
    </div>
  );
}

CandidateRankingRow.Header = RankingRowHeader;
export default CandidateRankingRow
