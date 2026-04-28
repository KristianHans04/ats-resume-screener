import React from 'react';

export default function AvatarPlaceholder({
  className = '',
  label = 'Profile photo placeholder',
  size = 'md',
  variant = 'default',
}) {
  const sizeClasses = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
  };

  const variantClasses = {
    default: 'surface-subtle text-slate-500 dark:text-slate-300',
    sidebar: 'sidebar-avatar text-slate-200',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-full border ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`.trim()}
      aria-label={label}
    >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[55%] w-[55%]">
        <circle cx="10" cy="7" r="3.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 16C4 13.4 6.55 11.6 10 11.6C13.45 11.6 16 13.4 16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
