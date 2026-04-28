import React from 'react';
import Card from '../ui/Card';
import StatusChip from '../ui/StatusChip';
import Button from '../ui/Button';
import CompanyLogo from '../ui/CompanyLogo';
import { getCompanyBranding, makeExcerpt } from '../../data/companyBranding';

const CalendarIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 opacity-60 shrink-0">
    <rect x="1" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1 5H11" stroke="currentColor" strokeWidth="1.2" />
    <path d="M4 1V3M8 1V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const QuestionIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0 text-accent">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5.5 5.5C5.5 4.67 6.17 4 7 4C7.83 4 8.5 4.67 8.5 5.5C8.5 6.17 8.1 6.73 7.5 7L7 7.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="7" cy="10" r="0.5" fill="currentColor" />
  </svg>
);

function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function toPercentage(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

function normalizeStatus(status) {
  return String(status || '').toLowerCase().replace(/_/g, '-').replace('awaiting-inquiry', 'inquiry-pending');
}

function ApplicationCardSkeleton() {
  return (
    <Card variant="default" padding="md" className="animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex w-full gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="flex w-full flex-col gap-2">
              <div className="h-3 w-1/3 rounded bg-slate-100 dark:bg-white/5" />
              <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          </div>
        </div>
        <div className="surface-subtle rounded-lg p-4">
          <div className="h-2.5 w-full rounded bg-slate-100 dark:bg-white/5" />
        </div>
        <div className="surface-divider flex items-center justify-between border-t pt-4">
          <div className="h-3 w-1/4 rounded bg-slate-100 dark:bg-white/5" />
          <div className="h-8 w-24 rounded bg-slate-200 dark:bg-white/10" />
        </div>
      </div>
    </Card>
  );
}

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

  const normalizedStatus = normalizeStatus(status);
  const brand = getCompanyBranding(company);
  const inquiryCount = (generated_questions || []).length;
  const resumeScore = finalScore;
  const hasFinalScore = finalScore !== null;
  const isInquiryPending = normalizedStatus === 'inquiry-pending';
  const isTerminal = normalizedStatus === 'rejected' || normalizedStatus === 'withdrawn';
  const isShortlisted = normalizedStatus === 'shortlisted' || normalizedStatus === 'hired';
  const cardVariant = isShortlisted ? 'gold' : normalizedStatus === 'rejected' ? 'danger' : 'default';
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
        <div className="flex items-start gap-3">
          <CompanyLogo company={company} compact className="shrink-0" />
          <div className="min-w-0 flex-1">
            {company && <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">{company}</p>}
            <div className="flex flex-wrap items-start gap-2">
              <h3 className="page-heading font-display text-lg leading-snug tracking-tight">{roleTitle}</h3>
              <StatusChip status={status} size="sm" className="mt-0.5 shrink-0" />
            </div>
            <p className="page-copy mt-1.5 text-sm leading-relaxed">{makeExcerpt(brand.headline, 92)}</p>
          </div>
        </div>

        {isInquiryPending && (
          <div className="flex items-center gap-3 rounded-lg border border-accent/20 bg-accent/10 px-4 py-3 text-xs text-accent" role="alert">
            <QuestionIcon />
            <span>
              {inquiryCount > 0
                ? `${inquiryCount} question${inquiryCount > 1 ? 's' : ''} waiting for your response`
                : 'Contextual questions are ready for you'}
            </span>
          </div>
        )}

        <div className="surface-subtle flex flex-col gap-2 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="page-copy font-medium">Resume match</span>
            <span className="page-heading font-mono font-semibold">{toPercentage(resumeScore)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="page-copy font-medium">Response quality</span>
            {hasFinalScore
              ? <span className="page-heading font-mono font-semibold">{toPercentage(impliedResponseScore)}</span>
              : <span className="page-label font-mono text-[10px] uppercase tracking-widest">Pending</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="surface-pill rounded-full px-2.5 py-1 text-[11px] font-medium">{brand.industry}</span>
          <span className="page-label flex items-center gap-2 font-mono text-xs">
            <CalendarIcon />
            Applied {formatDate(appliedDate)}
          </span>
        </div>

        <div className="surface-divider mt-1 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <div />

          {isInquiryPending && (
            <Button variant="primary" size="sm" onClick={onViewInquiry}>
              Answer questions
            </Button>
          )}

          {hasFinalScore && !isInquiryPending && (
            <Button variant="outline" size="sm" onClick={onViewSummary}>
              View summary
            </Button>
          )}

          {!hasFinalScore && !isInquiryPending && !isTerminal && (
            <Button variant="ghost" size="sm" isDisabled>
              Processing…
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
