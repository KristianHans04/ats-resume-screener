import React from 'react';
import { useTheme } from '../../context/ThemeContext';

function SunIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 1.75V4M10 16V18.25M18.25 10H16M4 10H1.75M15.83 4.17L14.24 5.76M5.76 14.24L4.17 15.83M15.83 15.83L14.24 14.24M5.76 5.76L4.17 4.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
      <path d="M15.23 12.79A6.75 6.75 0 0 1 7.21 4.77 7 7 0 1 0 15.23 12.79Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`.trim()}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className={`theme-toggle-segment ${!isDark ? 'is-active' : ''}`}>
        <SunIcon />
        <span className="hidden sm:inline">Light</span>
      </span>
      <span className={`theme-toggle-segment ${isDark ? 'is-active' : ''}`}>
        <MoonIcon />
        <span className="hidden sm:inline">Dark</span>
      </span>
    </button>
  );
}
