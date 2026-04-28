import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';
import CompanyLogo from '../../components/ui/CompanyLogo';

const SEEDED_COMPANIES = [
  'Safaricom PLC',
  'Andela',
  'M-KOPA',
  'Absa Bank Kenya PLC',
];

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
    <div className="page-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-transparent p-4 font-body">
      <div className="absolute right-4 top-4 md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <div className="z-raised w-full max-w-6xl animate-fade-in-up">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="surface-card hidden min-h-[640px] flex-col justify-between rounded-[28px] p-8 lg:flex xl:p-10">
            <div className="space-y-8">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </span>
                <div>
                  <p className="font-display text-base tracking-tight">CSAS Platform</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Candidate screening and recruiter workflows</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">Hiring Workspace</p>
                <h1 className="font-display text-5xl leading-[1.02] tracking-tight text-slate-950 dark:text-white">
                  Structured hiring without prototype noise.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  Candidates get a focused application flow. Recruiters get role visibility, inquiry handling, and applicant review in one workspace that looks ready for real use.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  ['6', 'Seeded demo roles'],
                  ['4', 'Employer brands wired in'],
                  ['24h', 'Target publishing cadence'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="font-display text-2xl text-slate-950 dark:text-white">{value}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Seeded employers in this environment
              </p>
              <div className="grid grid-cols-2 gap-4">
                {SEEDED_COMPANIES.map((company) => (
                  <div key={company} className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
                    <CompanyLogo company={company} compact />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{company}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">Branded sample workspace</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="w-full max-w-[520px] justify-self-center lg:max-w-none">
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-7 w-7" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <h1 className="mb-2 font-display text-3xl font-bold tracking-tight text-slate-950 dark:text-white">CSAS Platform</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isSignUp ? 'Create your workspace account' : 'Secure sign in for candidates and recruiters'}
              </p>
            </div>

            <div className="glass-card rounded-[28px] p-6 shadow-2xl md:p-8">
              <div className="mb-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                  {isSignUp ? 'Create account' : 'Welcome back'}
                </p>
                <h2 className="mt-3 font-display text-3xl tracking-tight text-slate-950 dark:text-white">
                  {isSignUp ? 'Access the hiring workspace.' : 'Sign in to continue.'}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Use `recruiter@example.com` or `candidate@example.com` with password `password` in the seeded environment.
                </p>
              </div>

              {error && (
                <div className="animate-shake mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">Email or Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="input-field px-5 py-3.5 text-sm"
                    placeholder="name@example.com or username"
                  />
                </div>

                {isSignUp && (
                  <div className="flex flex-col gap-2">
                    <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="input-field px-5 py-3.5 text-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="input-label font-mono text-[10px] font-bold uppercase tracking-widest">Password</label>
                    {!isSignUp && <button type="button" className="font-mono text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">Help</button>}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input-field px-5 py-3.5 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                {isSignUp && (
                  <div className="mt-2 flex flex-col gap-3">
                    <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">Account type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['CANDIDATE', 'Candidate'],
                        ['RECRUITER', 'Recruiter'],
                      ].map(([value, displayLabel]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRole(value)}
                          className={`rounded-2xl border p-4 text-left transition-colors ${
                            role === value
                              ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                              : 'surface-subtle text-slate-600 hover:border-slate-400/40 dark:text-slate-300'
                          }`}
                        >
                          <p className="font-semibold">{displayLabel}</p>
                          <p className="mt-2 text-xs opacity-80">
                            {value === 'CANDIDATE' ? 'Apply for roles and respond to inquiries.' : 'Create roles and review applicants.'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" className="mt-4 w-full" isLoading={loading}>
                  {isSignUp ? 'Create account' : 'Sign in'}
                </Button>
              </form>

              <div className="surface-divider mt-10 border-t pt-6 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isSignUp ? 'Already registered?' : 'Need an account?'}
                  <button
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

        <p className="page-label mt-8 text-center font-mono text-[9px] uppercase tracking-[0.2em]">
          Advanced Agentic Coding &bull; Version 2.4.0
        </p>
      </div>
    </div>
  );
}
