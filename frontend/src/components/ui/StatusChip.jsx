import React from 'react';

const STATUS_LABELS = {
  // Application states
  'pending':          'Pending',
  'under-review':     'Under Review',
  'inquiry-pending':  'Inquiry Pending',
  'shortlisted':      'Shortlisted',
  'hired':            'Hired',
  'rejected':         'Rejected',
  'withdrawn':        'Withdrawn',

  // Semantic alignment
  'high':             'High Alignment',
  'medium':           'Above Threshold',
  'gap':              'Semantic Gap',
  'critical':         'Critical Gap',

  // Misc
  'role':             'Role',
  'new':              'New',
};

const PULSE_BY_DEFAULT = new Set([
  'under-review',
  'inquiry-pending',
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
  const displayLabel = label ?? STATUS_LABELS[status] ?? status;
  const showDot = dot !== undefined ? dot : PULSE_BY_DEFAULT.has(status);
  const doPulse = pulse !== undefined ? pulse : PULSE_BY_DEFAULT.has(status);

  // Size configurations
  const sizeClasses = {
    sm: "text-[10px] px-3 h-5",
    md: "text-xs px-3 h-[26px]"
  };

  // Variant color mapping (Minimalist Semantic Palette)
  const variantClasses = {
    // Application States
    'pending': 'bg-gray-100 border-gray-200 text-gray-500',
    'under-review': 'bg-blue-50 border-blue-200 text-blue-600',
    'inquiry-pending': 'bg-orange-50 border-orange-200 text-orange-500',
    'shortlisted': 'bg-emerald-50 border-emerald-200 text-emerald-600',
    'hired': 'bg-green-100 border-green-300 text-green-600 shadow-[0_0_10px_rgba(74,222,128,0.2)]',
    'rejected': 'bg-red-50 border-red-200 text-red-600',
    'withdrawn': 'bg-transparent border-border text-gray-400 opacity-70',
    
    // Semantic Brackets
    'high': 'bg-emerald-50 border-emerald-200 text-emerald-600',
    'medium': 'bg-orange-50 border-orange-200 text-orange-500', // Above τ threshold
    'gap': 'bg-amber-50 border-amber-200 text-amber-600',       // Below τ, triggers RAG
    'critical': 'bg-red-50 border-red-200 text-red-600',
    
    // Misc
    'role': 'bg-neutral-light border-border text-neutral-dark',
    'new': 'bg-cyan-50 border-cyan-200 text-accent',
  };

  const finalClasses = [
    "inline-flex items-center gap-2 font-mono font-medium tracking-wider uppercase rounded-full border whitespace-nowrap transition-all duration-150",
    sizeClasses[size],
    variantClasses[status] || variantClasses['pending'],
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