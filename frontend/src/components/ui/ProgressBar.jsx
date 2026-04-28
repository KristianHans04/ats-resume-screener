import React from 'react';

/* --- Bracket thresholds for semantic variant --- */
const SEMANTIC_COLORS = {
  high:     '#4ade80',   /* ≥ 75 — strong alignment */
  medium:   '#f2bc30',   /* 60–74 — above τ threshold */
  gap:      '#f97316',   /* 35–59 — below τ, RAG inquiry triggered (Updated to alt accent) */
  critical: '#ef4444',   /* < 35  — critical gap */
};

function getSemanticColor(value) {
  if (value >= 75) return SEMANTIC_COLORS.high;
  if (value >= 60) return SEMANTIC_COLORS.medium;
  if (value >= 35) return SEMANTIC_COLORS.gap;
  return SEMANTIC_COLORS.critical;
}

function normalise(value) {
  if (value === null || value === undefined) return 0;
  const num = parseFloat(value);
  if (num <= 1 && !Number.isInteger(num)) return Math.round(num * 100);
  return Math.min(100, Math.max(0, Math.round(num)));
}

function formatValue(raw, percent) {
  const num = parseFloat(raw);
  if (num > 0 && num <= 1 && !Number.isInteger(num)) {
    return num.toFixed(2);
  }
  return `${percent}%`;
}

export default function ProgressBar({
  value = 0,
  label,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = false,
  striped = false,
  threshold = false,
  thresholdValue = 60,
  thresholdLabel = 'τ = 0.6',
  thresholdBelow = false,
  resumeScore = 0,
  responseScore = 0,
  showLegend = false,
  className = '',
  ...rest
}) {
  const percent = normalise(value);
  const displayValue = formatValue(value, percent);
  const isStacked = variant === 'stacked';

  // Size mappings for the track height
  const heightClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5'
  };
  const currentHeight = heightClasses[size] || heightClasses.md;

  // Determine background color based on variant
  let fillColorClass = 'bg-slate-800 dark:bg-slate-100'; // Default
  let inlineStyle = { width: `${percent}%` };

  if (variant === 'gold') {
    fillColorClass = 'bg-accent'; // Cyan accent
  } else if (variant === 'semantic') {
    fillColorClass = '';
    inlineStyle.backgroundColor = getSemanticColor(percent);
  }

  // Animation and Stripe classes
  const transitionClass = animated ? 'transition-[width] duration-700 ease-out' : '';
  const stripeClass = striped ? 'bg-[length:28px_28px] animate-[progress-stripe_0.8s_linear_infinite] bg-[image:repeating-linear-gradient(-45deg,transparent,transparent_5px,rgba(255,255,255,0.1)_5px,rgba(255,255,255,0.1)_10px)]' : '';

  return (
    <div
      className={`flex flex-col gap-2 w-full ${className}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
      {...rest}
    >
      {/* Header row: label + value */}
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && <span className="page-copy text-sm font-medium leading-none">{label}</span>}
          {showValue && <span className="page-heading font-mono text-sm font-medium whitespace-nowrap">{displayValue}</span>}
        </div>
      )}

      {/* Track */}
      <div className={`relative w-full rounded-full border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-800 ${!threshold ? 'overflow-hidden' : ''} ${currentHeight}`}>

        {/* ── Stacked variant ── */}
        {isStacked ? (
          <div className="flex h-full w-full rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-800 transition-[width] duration-500 ease-out dark:bg-slate-100"
              style={{ width: `${normalise(resumeScore)}%` }}
            />
            <div
              className="h-full bg-accent border-l border-slate-200 transition-[width] duration-500 ease-out dark:border-slate-800"
              style={{ width: `${normalise(responseScore)}%` }}
            />
          </div>
        ) : (
          /* ── Single fill bar ── */
          <div
            className={`h-full rounded-full relative ${fillColorClass} ${transitionClass} ${stripeClass}`}
            style={inlineStyle}
          />
        )}

        {/* ── Threshold marker ── */}
        {threshold && (
          <div
            className="absolute top-1/2 -translate-y-1/2 z-10 h-[calc(100%+8px)] w-[2px] rounded-full bg-slate-800 dark:bg-slate-100"
            style={{ left: `${thresholdValue}%` }}
            aria-hidden="true"
          >
            <span
              className={`page-heading absolute left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-wider uppercase whitespace-nowrap pointer-events-none select-none ${
                thresholdBelow ? 'top-[calc(100%+6px)]' : 'bottom-[calc(100%+6px)]'
              }`}
            >
              {thresholdLabel}
            </span>
          </div>
        )}
      </div>

      {/* Stacked legend */}
      {isStacked && showLegend && (
        <div className="flex gap-4 mt-2" aria-hidden="true">
          <div className="page-copy flex items-center gap-2 font-mono text-xs">
            <span className="h-2 w-2 shrink-0 rounded-[2px] bg-slate-800 dark:bg-slate-100" />
            Resume Match (×0.4)
          </div>
          <div className="page-copy flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-[2px] shrink-0 bg-accent" />
            Response Quality (×0.6)
          </div>
        </div>
      )}
    </div>
  );
}
