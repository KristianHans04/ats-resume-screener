import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  icon: Icon,
  onClick,
  className = '',
  ...rest
}) {
  // Base classes (Translating your transition, focus ring, and active states)
  const baseClasses = "inline-flex items-center justify-center gap-2 font-body font-semibold uppercase rounded-md border transition-all duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent whitespace-nowrap";
  
  // Size mappings
  const sizeClasses = {
    sm: "text-xs px-4 h-8 gap-1",
    md: "text-sm px-6 h-[42px]",
    lg: "text-base px-8 h-[52px] tracking-wider"
  };

  // Variant mappings (Minimalist Semantic Theme)
  const variantClasses = {
    primary: "bg-accent border-accent text-white hover:bg-cyan-400 active:bg-cyan-600 active:translate-y-[1px] shadow-sm hover:shadow-md",
    secondary: "bg-neutral-light border-border text-neutral-dark hover:bg-gray-200 active:bg-gray-300 active:translate-y-[1px]",
    outline: "bg-transparent border-border text-neutral-dark hover:border-accent hover:text-accent active:bg-gray-50 active:translate-y-[1px]",
    ghost: "bg-transparent border-transparent text-gray-500 hover:bg-neutral-light hover:text-neutral-dark active:bg-gray-200 active:translate-y-[1px]",
    danger: "bg-transparent border-red-200 text-red-500 hover:bg-red-50 hover:border-red-500 active:bg-red-100 active:translate-y-[1px]"
  };

  // State modifiers
  const stateClasses = (isDisabled || isLoading) 
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
      disabled={isDisabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && (
        <svg className="w-4 h-4 animate-spin text-current shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && Icon && <Icon className="shrink-0 w-4 h-4" />}
      {children}
    </button>
  );
}