import React from 'react';

const STATUS_LABELS = {
  // Application states (lowercase)
  'pending':          'Pending',
  'under-review':     'Under Review',
  'inquiry-pending':  'Inquiry Pending',
  'shortlisted':      'Shortlisted',
  'hired':            'Hired',
  'rejected':         'Rejected',
  'withdrawn':        'Withdrawn',

  // Application states (uppercase from backend)
  'PENDING':           'Pending',
  'PARSING':           'Processing',
  'AWAITING_INQUIRY':  'Inquiry Pending',
  'EVALUATING':        'Evaluating',
  'SCORED':            'Scored',
  'COMPLETED':         'Completed',
  'SHORTLISTED':       'Shortlisted',
  'REJECTED':          'Rejected',
  'FAILED':            'Failed',

  // Semantic alignment
  'high':             'High Alignment',
  'medium':           'Above Threshold',
  'gap':              'Semantic Gap',
  'critical':         'Critical Gap',

  // Misc
  'role':             'Role',
  'new':              'New',
};

// Map uppercase backend statuses to style keys
const STATUS_STYLE_MAP = {
  'PENDING':           'pending',
  'PARSING':           'under-review',
  'AWAITING_INQUIRY':  'inquiry-pending',
  'EVALUATING':        'under-review',
  'SCORED':            'shortlisted',
  'COMPLETED':         'shortlisted',
  'SHORTLISTED':       'shortlisted',
  'REJECTED':          'rejected',
  'FAILED':            'rejected',
};

const PULSE_BY_DEFAULT = new Set([
  'under-review',
  'inquiry-pending',
  'AWAITING_INQUIRY',
  'PARSING',
  'EVALUATING',
]);

export default function StatusChip({
  status,
  label,
  size = 'md',
  dot,
  pulse,
  className = '',
  ...rest
}) {
  const normalizedStatus = String(status || '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace('awaiting-inquiry', 'inquiry-pending')
    .replace('scored', 'under-review')
    .replace('completed', 'under-review');

  const displayLabel = label ?? STATUS_LABELS[status] ?? STATUS_LABELS[normalizedStatus] ?? status;
  const showDot = dot !== undefined ? dot : PULSE_BY_DEFAULT.has(status) || PULSE_BY_DEFAULT.has(normalizedStatus);
  const doPulse = pulse !== undefined ? pulse : PULSE_BY_DEFAULT.has(status) || PULSE_BY_DEFAULT.has(normalizedStatus);

  // Resolve uppercase statuses to style keys
  const styleKey = STATUS_STYLE_MAP[status] || normalizedStatus;

  // Size configurations
  const sizeClasses = {
    sm: "text-[10px] px-3 h-5",
    md: "text-xs px-3 h-[26px]"
  };

  // Variant color mapping (Minimalist Semantic Palette)
  const variantClasses = {
    // Application States
    'pending': 'bg-slate-100/80 border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-gray-400',
    'under-review': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    'inquiry-pending': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    'shortlisted': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    'hired': 'bg-emerald-500/20 border-emerald-500/30 text-emerald-500 dark:text-emerald-300',
    'rejected': 'bg-red-500/10 border-red-500/20 text-red-400',
    'withdrawn': 'bg-slate-100/80 border-slate-200 text-slate-500 opacity-70 dark:bg-white/5 dark:border-white/10 dark:text-gray-500',
    
    // Semantic Brackets
    'high': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    'medium': 'bg-orange-500/10 border-orange-500/20 text-orange-400', // Above τ threshold
    'gap': 'bg-amber-500/10 border-amber-500/20 text-amber-400',       // Below τ, triggers RAG
    'critical': 'bg-red-500/10 border-red-500/20 text-red-400',
    
    // Misc
    'role': 'bg-slate-100/80 border-slate-200 text-slate-800 dark:bg-white/10 dark:border-white/10 dark:text-white',
    'new': 'bg-accent/10 border-accent/20 text-accent',
  };

  const finalClasses = [
    "inline-flex items-center gap-2 font-mono font-medium tracking-wider uppercase rounded-full border whitespace-nowrap transition-all duration-150",
    sizeClasses[size],
    variantClasses[styleKey] || variantClasses['pending'],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={finalClasses} {...rest}>
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${doPulse ? 'animate-pulse' : ''}`}
          aria-hidden="true"
        />
      )}
      {displayLabel}
    </span>
  );
}
