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
    'pending': 'dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/5 dark:text-gray-400 text-black/60',
    'under-review': 'dark:bg-blue-500/10 bg-blue-500/5 dark:border-blue-500/20 border-blue-500/10 dark:text-blue-400 text-blue-800',
    'inquiry-pending': 'dark:bg-orange-500/10 bg-orange-500/5 dark:border-orange-500/20 border-orange-500/10 dark:text-orange-400 text-orange-800',
    'shortlisted': 'dark:bg-emerald-500/10 bg-emerald-500/5 dark:border-emerald-500/20 border-emerald-500/10 dark:text-emerald-400 text-emerald-800',
    'hired': 'dark:bg-emerald-500/20 bg-emerald-500/10 dark:border-emerald-500/30 border-emerald-500/20 dark:text-emerald-300 text-emerald-900 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    'rejected': 'dark:bg-red-500/10 bg-red-500/5 dark:border-red-500/20 border-red-500/10 dark:text-red-400 text-red-800',
    'withdrawn': 'dark:bg-white/5 bg-black/5 dark:border-white/10 border-black/5 dark:text-gray-500 text-black/40 opacity-70',
    
    // Semantic Brackets
    'high': 'dark:bg-emerald-500/10 bg-emerald-500/5 dark:border-emerald-500/20 border-emerald-500/10 dark:text-emerald-400 text-emerald-800',
    'medium': 'dark:bg-orange-500/10 bg-orange-500/5 dark:border-orange-500/20 border-orange-500/10 dark:text-orange-400 text-orange-800', // Above τ threshold
    'gap': 'dark:bg-amber-500/10 bg-amber-500/5 dark:border-amber-500/20 border-amber-500/10 dark:text-amber-400 text-amber-800',       // Below τ, triggers RAG
    'critical': 'dark:bg-red-500/10 bg-red-500/5 dark:border-red-500/20 border-red-500/10 dark:text-red-400 text-red-800',
    
    // Misc
    'role': 'dark:bg-white/10 bg-black/5 dark:border-white/10 border-black/5 dark:text-white text-black',
    'new': 'dark:bg-accent/10 bg-accent/5 dark:border-accent/20 border-accent/10 text-accent',
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