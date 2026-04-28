import React from 'react';

const STATUS_LABELS = {
  'pending':          'Pending',
  'under-review':     'Under Review',
  'inquiry-pending':  'Inquiry Pending',
  'shortlisted':      'Shortlisted',
  'hired':            'Hired',
  'rejected':         'Rejected',
  'withdrawn':        'Withdrawn',

  'PENDING':           'Pending',
  'PARSING':           'Processing',
  'AWAITING_INQUIRY':  'Inquiry Pending',
  'EVALUATING':        'Evaluating',
  'SCORED':            'Scored',
  'COMPLETED':         'Completed',
  'SHORTLISTED':       'Shortlisted',
  'REJECTED':          'Rejected',
  'FAILED':            'Failed',

  'high':     'High Alignment',
  'medium':   'Above Threshold',
  'gap':      'Semantic Gap',
  'critical': 'Critical Gap',

  'role': 'Role',
  'new':  'New',
};

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

const TEXT_COLOR = {
  'pending':        'text-slate-500 dark:text-slate-400',
  'under-review':   'text-blue-500 dark:text-blue-400',
  'inquiry-pending':'text-orange-500 dark:text-orange-400',
  'shortlisted':    'text-emerald-600 dark:text-emerald-400',
  'hired':          'text-emerald-700 dark:text-emerald-300',
  'rejected':       'text-red-500 dark:text-red-400',
  'withdrawn':      'text-slate-400',
  'high':           'text-emerald-600 dark:text-emerald-400',
  'medium':         'text-orange-500 dark:text-orange-400',
  'gap':            'text-amber-600 dark:text-amber-400',
  'critical':       'text-red-500 dark:text-red-400',
  'role':           'text-slate-700 dark:text-white',
  'new':            'text-accent',
};

const SIZE = {
  sm: 'text-[10px]',
  md: 'text-xs',
};

export default function StatusChip({ status, label, size = 'md', className = '', ...rest }) {
  const normalizedStatus = String(status || '')
    .toLowerCase()
    .replace(/_/g, '-')
    .replace('awaiting-inquiry', 'inquiry-pending')
    .replace('scored', 'under-review')
    .replace('completed', 'under-review');

  const displayLabel = label ?? STATUS_LABELS[status] ?? STATUS_LABELS[normalizedStatus] ?? status;
  const styleKey = STATUS_STYLE_MAP[status] || normalizedStatus;

  const finalClasses = [
    'inline-flex items-center font-mono font-semibold tracking-wider uppercase whitespace-nowrap',
    SIZE[size] || SIZE.md,
    TEXT_COLOR[styleKey] || TEXT_COLOR['pending'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={finalClasses} {...rest}>
      {displayLabel}
    </span>
  );
}
