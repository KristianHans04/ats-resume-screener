import React from 'react';

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  loading = false,
  className = '',
  onClick,
  ...rest
}) {
  // Variant Mappings
  const variantClasses = {
    default: "glass-card dark:border-white/10 border-black/5",
    elevated: "glass-card shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] dark:border-white/10 border-black/5",
    gold: "glass-card border-accent/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    ghost: "bg-transparent border-transparent shadow-none",
    danger: "dark:bg-red-500/10 bg-red-500/5 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    success: "dark:bg-emerald-500/10 bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
  };

  // Padding Mappings
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  // Interactive Hover/Focus States
  const hoverClasses = hoverable 
    ? "cursor-pointer hover:border-gray-300 dark:hover:border-white/30 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent" 
    : "";

  // Loading state (using Tailwind's animate-pulse for a clean skeleton shimmer)
  const loadingClasses = loading ? "pointer-events-none animate-pulse" : "";

  const finalClasses = [
    "relative border dark:border-white/10 border-black/5 rounded-xl overflow-hidden transition-all duration-200",
    variantClasses[variant],
    hoverClasses,
    loadingClasses,
    className
  ].filter(Boolean).join(' ');

  const interactiveProps = hoverable
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : { onClick };

  return (
    <div className={finalClasses} {...interactiveProps} {...rest}>
      <div className={`w-full h-full ${paddingClasses[padding]}`}>
        {children}
      </div>
    </div>
  );
}

/* ── Card.Header Sub-component ── */
Card.Header = function CardHeader({
  title,
  subtitle,
  eyebrow,
  children,
  noDivider = false,
  className = '',
}) {
  const headerClasses = [
    "flex items-start justify-between gap-4",
    noDivider ? "mb-3" : "pb-4 mb-4 border-b dark:border-white/10 border-black/5",
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={headerClasses}>
      <div>
        {eyebrow && <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">{eyebrow}</p>}
        {title && <h3 className="text-lg leading-snug font-medium dark:text-white text-black">{title}</h3>}
        {subtitle && <p className="text-sm dark:text-gray-400 text-black/70 mt-1 leading-relaxed">{subtitle}</p>}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
};

/* ── Card.Body Sub-component ── */
Card.Body = function CardBody({ children, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

/* ── Card.Footer Sub-component ── */
Card.Footer = function CardFooter({
  children,
  align = 'right',
  className = '',
}) {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    between: "justify-between",
  };

  const footerClasses = [
    "flex items-center gap-3 pt-4 mt-4 border-t dark:border-white/10 border-black/5",
    alignClasses[align],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={footerClasses}>
      {children}
    </div>
  );
};