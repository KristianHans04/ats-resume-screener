import React from 'react';
import Card from '../ui/Card';

/* ── Trend arrow icons ───────────────────────────────────── */
const TrendUpIcon = () => (
  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 shrink-0">
    <path d="M2 7L5 4L8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendDownIcon = () => (
  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 shrink-0">
    <path d="M2 3L5 6L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendFlatIcon = () => (
  <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 shrink-0">
    <path d="M2 5H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ── Sparkline ───────────────────────────────────────────── */
function Sparkline({ data, variant }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);

  return (
    <div className="flex items-end gap-[3px] h-7 shrink-0" aria-hidden="true">
      {data.map((val, i) => {
        const isLast = i === data.length - 1;
        // The last bar acts as the "current" active indicator
        let barColor = isLast 
          ? (variant === 'gold' ? 'bg-accent' : 'bg-gray-400')
          : (variant === 'gold' ? 'bg-cyan-100' : 'bg-gray-200');

        return (
          <div
            key={i}
            className={`w-1 rounded-t-[2px] min-h-[4px] transition-all duration-500 ${barColor}`}
            style={{ height: `${Math.round((val / max) * 100)}%` }}
          />
        );
      })}
    </div>
  );
}

/* ── Delta badge ─────────────────────────────────────────── */
function DeltaBadge({ delta }) {
  if (delta === null || delta === undefined) return null;

  const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
  const absValue = Math.abs(delta);
  const formatted = Number.isInteger(absValue) ? absValue.toString() : absValue.toFixed(2);

  const styles = direction === 'up' ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/20' :
                 direction === 'down' ? 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/10 dark:border-red-500/20' :
                 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-white/5 dark:border-white/10';

  return (
    <span className={`inline-flex items-center gap-1 font-mono text-[10px] font-medium px-1.5 py-0.5 rounded border ${styles}`}>
      {direction === 'up' && <TrendUpIcon />}
      {direction === 'down' && <TrendDownIcon />}
      {direction === 'neutral' && <TrendFlatIcon />}
      {delta > 0 ? '+' : delta < 0 ? '−' : ''}{formatted}
    </span>
  );
}

/* ── Skeleton ────────────────────────────────────────────── */
function MetricSkeleton() {
  return (
    <Card variant="default" padding="md" className="animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="w-1/2 h-3 bg-gray-200 rounded" />
        <div className="w-20 h-10 bg-gray-200 rounded mt-1" />
        <div className="w-3/4 h-2.5 bg-gray-100 rounded mt-2" />
      </div>
    </Card>
  );
}

/* ── Component ───────────────────────────────────────────── */
export default function MetricWidget({
  label = '', value = '—', unit, icon, iconVariant = 'sapphire',
  delta = null, deltaLabel = '', description = '',
  sparkline, variant = 'default', loading = false,
}) {
  if (loading) return <MetricSkeleton />;

  // Translate icon variants to Minimalist Semantic Tailwind colors
  const iconColors = {
    gold: 'bg-cyan-50 border-cyan-200 text-accent',
    sapphire: 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-300',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    warning: 'bg-orange-50 border-orange-200 text-orange-500'
  };

  const cardVariant = variant === 'gold' ? 'gold' : 'default';

  return (
    <Card variant={cardVariant} padding="md">
      <div className="flex flex-col gap-4">

        {/* Header: Label + Icon */}
        <div className="flex items-start justify-between gap-3">
          <p className="page-label font-mono text-xs tracking-widest uppercase leading-none">{label}</p>
          {icon && (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${iconColors[iconVariant] || iconColors.sapphire}`} aria-hidden="true">
              <span className="w-4 h-4">{icon}</span>
            </div>
          )}
        </div>

        {/* Primary Value */}
        <div className="flex items-end gap-2">
          <span className={`font-mono text-3xl font-medium leading-none tabular-nums tracking-tight ${variant === 'gold' ? 'text-accent' : 'page-heading'}`}>
            {value}
          </span>
          {unit && <span className="page-label font-mono text-sm pb-0.5 leading-none">{unit}</span>}
        </div>

        {/* Footer: Delta, Description, Sparkline */}
        {(delta !== null || description || sparkline) && (
          <div className="flex items-center justify-between gap-3 pt-3 mt-1 border-t border-border">
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              {delta !== null && (
                <div className="flex items-center gap-2">
                  <DeltaBadge delta={delta} />
                  {deltaLabel && <span className="page-copy text-xs truncate">{deltaLabel}</span>}
                </div>
              )}
              {description && <p className="page-copy text-[11px] leading-snug pr-2">{description}</p>}
            </div>
            {sparkline && <Sparkline data={sparkline} variant={variant} />}
          </div>
        )}
      </div>
    </Card>
  );
}
