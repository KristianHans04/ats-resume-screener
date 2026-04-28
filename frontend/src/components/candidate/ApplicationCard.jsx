import React from 'react';
import Card from '../ui/Card';
import StatusChip from '../ui/StatusChip';
import Button from '../ui/Button';

/* ── Inline SVG icons ────────────────────────────────────── */
const CalendarIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60 shrink-0">
    <rect x="1" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M1 5H11" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4 1V3M8 1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const QuestionIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 text-accent">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.1 6.73 7.5 7L7 7.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="7" cy="10" r="0.5" fill="currentColor"/>
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────── */
function formatDate(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Converts decimals to percentages safely (e.g. 0.64 -> 64%, 84 -> 84%)
function toPercentage(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

/* ── Skeleton loading state ──────────────────────────────── */
function ApplicationCardSkeleton() {
  return (
    <Card variant="default" padding="md" className="animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 w-full">
            <div className="h-3 bg-white/5 rounded w-1/3"></div>
            <div className="h-5 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>
        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="h-2.5 bg-white/5 rounded w-full"></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="h-3 bg-white/5 rounded w-1/4"></div>
          <div className="h-8 bg-white/10 rounded w-24"></div>
        </div>
      </div>
    </Card>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function ApplicationCard({
  application = {},
  onViewInquiry,
  onViewSummary,
  loading = false,
}) {
  if (loading) return <ApplicationCardSkeleton />;

  const {
    job_title: roleTitle = 'Untitled Role',
    company_name: company = '',
    status = 'pending',
    ai_score: finalScore = null,
    generated_questions,
    created_at: appliedDate,
  } = application;

  const inquiryCount = (generated_questions || []).length;
  const resumeScore = finalScore; // For now mapping to the same as we don't have split scores


  const hasFinalScore = finalScore !== null;
  const isInquiryPending = status === 'inquiry-pending';
  const isTerminal = status === 'rejected' || status === 'withdrawn';
  const isShortlisted = status === 'shortlisted' || status === 'hired';

  const cardVariant = isShortlisted ? 'gold' : status === 'rejected' ? 'danger' : 'default';

  // Derive Response Score if we have the Final Score (S_final = Resume*0.4 + Response*0.6)
  const impliedResponseScore = hasFinalScore ? (finalScore - (resumeScore * 0.4)) / 0.6 : null;

  return (
    <Card 
      variant={cardVariant} 
      padding="md" 
      className={`
        ${isInquiryPending ? 'border-accent shadow-[0_0_0_1px_rgba(6,182,212,0.15)]' : ''}
        ${isTerminal ? 'opacity-60 hover:opacity-80 transition-opacity' : ''}
      `}
    >
      <div className="flex flex-col gap-4">
        
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col min-w-0 pr-2">
            {company && <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">{company}</p>}
            <h3 className="font-display text-lg text-white leading-snug tracking-tight">{roleTitle}</h3>
          </div>
          <div className="shrink-0 pt-1">
            <StatusChip status={status} size="sm" />
          </div>
        </div>

        {/* ── Inquiry pending banner ── */}
        {isInquiryPending && (
          <div className="flex items-center gap-3 px-4 py-3 bg-accent/10 border border-accent/20 rounded-lg text-xs text-accent-light" role="alert">
            <QuestionIcon />
            <span className="text-accent">
              {inquiryCount > 0
                ? `${inquiryCount} question${inquiryCount > 1 ? 's' : ''} waiting for your response`
                : 'Contextual questions are ready for you'}
            </span>
          </div>
        )}

        {/* ── Clean Text Scores ── */}
        <div className="flex flex-col gap-2 p-4 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Resume Match:</span>
            <span className="font-mono text-white font-semibold">{toPercentage(resumeScore)}</span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-medium">Response Quality:</span>
            {hasFinalScore ? (
              <span className="font-mono text-white font-semibold">{toPercentage(impliedResponseScore)}</span>
            ) : (
              <span className="font-mono text-gray-500 text-[10px] uppercase tracking-widest">Pending</span>
            )}
          </div>
        </div>

        {/* ── Meta ── */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-2 font-mono text-xs text-gray-500">
            <CalendarIcon />
            Applied {formatDate(appliedDate)}
          </span>
        </div>

        {/* ── Footer / Actions ── */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 flex-wrap mt-1">
          <div className="flex items-center gap-3"></div>

          {isInquiryPending && (
            <Button variant="primary" size="sm" onClick={onViewInquiry}>
              Answer Questions
            </Button>
          )}

          {hasFinalScore && !isInquiryPending && (
            <Button variant="outline" size="sm" onClick={onViewSummary}>
              View Summary
            </Button>
          )}

          {!hasFinalScore && !isInquiryPending && !isTerminal && (
            <Button variant="ghost" size="sm" disabled>
              Processing…
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}