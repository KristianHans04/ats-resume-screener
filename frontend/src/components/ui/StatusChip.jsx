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
    'pending': 'bg-white/5 border-white/10 text-gray-400',
    'under-review': 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    'inquiry-pending': 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    'shortlisted': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    'hired': 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    'rejected': 'bg-red-500/10 border-red-500/20 text-red-400',
    'withdrawn': 'bg-white/5 border-white/10 text-gray-500 opacity-70',
    
    // Semantic Brackets
    'high': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    'medium': 'bg-orange-500/10 border-orange-500/20 text-orange-400', // Above τ threshold
    'gap': 'bg-amber-500/10 border-amber-500/20 text-amber-400',       // Below τ, triggers RAG
    'critical': 'bg-red-500/10 border-red-500/20 text-red-400',
    
    // Misc
    'role': 'bg-white/10 border-white/10 text-white',
    'new': 'bg-accent/10 border-accent/20 text-accent',
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