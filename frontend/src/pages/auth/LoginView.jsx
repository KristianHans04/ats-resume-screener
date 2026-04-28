import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import ThemeToggle from '../../components/ui/ThemeToggle';

const features = [
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M10 2C6.69 2 4 4.69 4 8C4 10.21 5.14 12.15 6.87 13.27L7 18H13L13.13 13.27C14.86 12.15 16 10.21 16 8C16 4.69 13.31 2 10 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'AI Resume Analysis',
    desc: 'Intelligent gap detection between your CV and the job requirements.',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M3 5H17M3 10H13M3 15H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Dynamic Inquiry',
    desc: 'Three targeted follow-up questions tailored to your application.',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Candidate Scoring',
    desc: 'Objective AI scoring that surfaces the strongest applications first.',
  },
  {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
        <path d="M17 12H3M14 9L17 12L14 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    label: 'End-to-End Workflow',
    desc: 'From job posting to accept or reject, all in one platform.',
  },
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
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden font-body md:flex-row">
      <div className="absolute right-4 top-4 z-20 sm:right-5 sm:top-5">
        <ThemeToggle />
      </div>

      {/* Left Panel */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-slate-950 px-8 py-10 md:w-1/2 md:min-h-screen md:px-14 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-10 flex items-center gap-3 md:mb-14">
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-[2.4rem]">
              CONTEXTUAL SEMANTIC ALIGNMENT<br/> SYSTEM FOR REDUCING ALGORITHMIC<br/> BIAS IN CANDIDATE SCREENING
            </h1>
            <p className="max-w-sm text-m leading-7 text-slate-400">
              An intelligent screening platform that helps spotlight hidden talent going beyond the CV to understand the full picture of every applicant.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-10">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4"
              >
                <span className="mt-0.5 shrink-0 text-cyan-400">{feature.icon}</span>
                <div>
                  <p className="text-[13px] font-semibold text-white">{feature.label}</p>
                  <p className="mt-0.5 text-[12px] leading-5 text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-700 md:mt-0">
          JKUAT &middot; Final Year Project &middot; 2026
        </p>
      </div>

      {/* Right Panel */}
      <div className="page-shell flex flex-1 items-center justify-center px-6 py-12 md:px-10 lg:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-7 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {isSignUp ? 'Create account' : 'Sign in'}
            </p>
            <h2 className="page-heading font-display text-2xl tracking-tight">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="page-copy text-sm leading-6">
              {isSignUp
                ? 'Set up your account to access candidate or recruiter workflows.'
                : 'Sign in to continue to your workspace.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                Email or Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field px-4 py-3 text-sm"
                placeholder="name@example.com"
              />
            </div>

            {isSignUp && (
              <div className="space-y-1.5">
                <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field px-4 py-3 text-sm"
                  placeholder="name@example.com"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="input-label ml-1 font-mono text-[10px] font-bold uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field px-4 py-3 text-sm"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
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
                      className={`rounded-2xl border p-3 text-left transition-colors ${
                        role === value
                          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
                          : 'surface-subtle text-slate-700 hover:border-slate-300 dark:text-slate-200 dark:hover:border-slate-600'
                      }`}
                    >
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-1 text-xs leading-5 opacity-70">{description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              {isSignUp ? 'Create account' : 'Sign in'}
            </Button>
          </form>

          <div className="surface-divider mt-6 border-t pt-5 text-center">
            <p className="page-copy text-sm">
              {isSignUp ? 'Already have an account?' : 'Need an account?'}
              <button
                type="button"
                onClick={() => setIsSignUp((v) => !v)}
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
