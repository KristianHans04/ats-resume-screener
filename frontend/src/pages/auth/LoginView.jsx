import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function LoginView() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const user = await register(username, email, password, role);
        navigate(user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/command-center');
      } else {
        const user = await login(username, password);
        navigate(user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/command-center');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell relative min-h-screen overflow-hidden bg-transparent px-4 py-10 font-body sm:px-6">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <div className="glass-card w-full rounded-[28px] p-6 shadow-xl sm:p-8">
          <div className="mb-8 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                {isSignUp ? 'Create account' : 'Sign in'}
              </p>
              <h1 className="page-heading font-display text-3xl tracking-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="page-copy text-sm leading-6">
                {isSignUp
                  ? 'Set up your account to access candidate or recruiter workflows.'
                  : 'Sign in to continue to your workspace.'}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="input-field px-4 py-3 text-sm"
                placeholder="name@example.com"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="input-field px-4 py-3 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input-field px-4 py-3 text-sm"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div className="space-y-3">
                <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['CANDIDATE', 'Candidate', 'Apply for roles and complete inquiries'],
                    ['RECRUITER', 'Recruiter', 'Create roles and review applicants'],
                  ].map(([value, label, description]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRole(value)}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        role === value
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                          : 'surface-subtle text-slate-700 hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-2 text-xs leading-5 opacity-80">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="surface-divider mt-8 border-t pt-5 text-center">
            <p className="page-copy text-sm">
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
              <button
                type="button"
                onClick={() => setIsSignUp((currentValue) => !currentValue)}
                className="ml-2 font-semibold text-slate-900 underline underline-offset-4 dark:text-white"
              >
                {isSignUp ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
