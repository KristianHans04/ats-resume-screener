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
    <div className="grid grid-cols-[48px_1fr_200px_120px_auto] items-center gap-4 p-4 px-5 bg-white/5 border border-white/10 rounded-xl animate-pulse">
      <div className="w-6 h-6 bg-white/10 rounded mx-auto" />
      <div className="flex flex-col gap-2">
        <div className="w-2/3 h-4 bg-white/10 rounded" />
        <div className="w-1/2 h-3 bg-white/5 rounded" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-full h-2.5 bg-white/10 rounded-full" />
        <div className="w-full h-2.5 bg-white/10 rounded-full" />
      </div>
      <div className="w-24 h-6 bg-white/10 rounded-full" />
      <div className="w-20 h-8 bg-white/10 rounded-md ml-auto" />
    </div>
  );
}

/* ── Header row ──────────────────────────────────────────── */
function RankingRowHeader() {
  return (
    <div className="grid grid-cols-[48px_1fr_200px_120px_auto] gap-4 px-5 py-2 mb-2 border-b border-white/10 select-none hidden md:grid">
      <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500 text-center">#</span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Candidate</span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Score Breakdown</span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Status</span>
      <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500 text-right">Action</span>
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
    id, name = 'Unknown Candidate', appliedRole = '—', appliedDate,
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
                     rank === 3 ? 'text-cyan-600 font-bold' : 'text-gray-500 font-medium';

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-[48px_1fr_200_120px_auto] items-center gap-4 p-4 px-5 bg-white/5 border border-white/10 rounded-xl transition-all duration-200
        hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:translate-x-0.5
        ${selected ? 'bg-accent/10 border-accent shadow-sm' : ''}
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
        <p className="text-base font-semibold text-white truncate">{name}</p>
        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-500 uppercase tracking-wider"><RoleIcon /> {appliedRole}</span>
          <span className="text-gray-700">·</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-gray-500 uppercase tracking-wider"><CalendarIcon /> {formatDate(appliedDate)}</span>
          {inquiryComplete && (
            <>
              <span className="text-gray-700">·</span>
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
          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-600">S_final</span>
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