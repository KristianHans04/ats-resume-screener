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
  const baseClasses = "inline-flex items-center justify-center gap-2 font-body font-semibold uppercase tracking-wider rounded-lg border transition-all duration-300 select-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]";
  
  // Size mappings
  const sizeClasses = {
    sm: "text-[10px] px-4 h-9 gap-1.5",
    md: "text-xs px-6 h-[44px]",
    lg: "text-sm px-8 h-[54px]"
  };

  // Variant mappings (Minimalist Semantic Theme)
  const variantClasses = {
    primary: "bg-accent border-accent text-white hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] border-none",
    secondary: "bg-white/10 border-white/10 text-white hover:bg-white/20 active:bg-white/30",
    outline: "bg-transparent border-white/20 text-white hover:border-accent hover:text-accent active:bg-white/5",
    ghost: "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white",
    danger: "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white active:bg-red-600"
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