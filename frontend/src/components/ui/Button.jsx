import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  loading, // Destructure to prevent leaking to DOM
  icon: Icon,
  onClick,
  className = '',
  ...rest
}) {
  const actualLoading = isLoading || loading;

  // Base classes (Translating your transition, focus ring, and active states)
  const baseClasses = "inline-flex items-center justify-center gap-2 font-body font-semibold rounded-xl border transition-colors duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent whitespace-nowrap shadow-sm";
  
  // Size mappings
  const sizeClasses = {
    sm: "text-xs px-4 h-9 gap-1.5",
    md: "text-sm px-5 h-[44px]",
    lg: "text-sm px-6 h-[50px]"
  };

  // Variant mappings (Minimalist Semantic Theme)
  const variantClasses = {
    primary: "border-slate-900 bg-slate-900 text-white hover:border-slate-800 hover:bg-slate-800 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:border-slate-200 dark:hover:bg-slate-100",
    secondary: "bg-slate-100/90 border-slate-200 text-slate-800 hover:bg-slate-200/80 dark:bg-white/10 dark:border-white/10 dark:text-white dark:hover:bg-white/18",
    outline: "bg-transparent border-slate-300 text-slate-700 hover:border-slate-500 hover:bg-slate-100/80 dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/8",
    ghost: "bg-transparent border-transparent text-slate-500 hover:bg-slate-200/60 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white shadow-none",
    danger: "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white dark:text-red-300 dark:hover:bg-red-500"
  };

  // State modifiers
  const stateClasses = (isDisabled || actualLoading) 
    ? "opacity-40 cursor-not-allowed pointer-events-none" 
    : "cursor-pointer";

  const fullWidthClass = isFullWidth ? "w-full" : "";

  // Combine all classes
  const finalClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    stateClasses,
    fullWidthClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={finalClasses}
      disabled={isDisabled || actualLoading}
      onClick={onClick}
      {...rest}
    >
      {actualLoading && (
        <svg className="w-4 h-4 animate-spin text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!actualLoading && Icon && <Icon className="shrink-0 w-4 h-4" />}
      {children}
    </button>
  );
}
