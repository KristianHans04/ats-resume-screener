import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext'; // Uncomment when AuthContext is ready
import Button from '../../components/ui/Button';

/* ── Icons ───────────────────────────────────────────────── */
const CandidateIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M2 16C2 13 5.13 11 9 11C12.87 11 16 13 16 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const RecruiterIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M6 16H12M9 12V16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 6.5L7.5 8.5L10 6L13 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── Component ───────────────────────────────────────────── */
const ROLES = [
  {
    id: 'candidate',
    name: 'Applicant',
    desc: 'Apply for roles and track progress',
    Icon: CandidateIcon,
    route: '/candidate/dashboard',
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    desc: 'Manage roles and review candidates',
    Icon: RecruiterIcon,
    route: '/recruiter/command-center',
  },
];

export default function LoginView() {
  const navigate = useNavigate();
  // const { login } = useAuth(); // Uncomment when ready

  const [selectedRole, setSelectedRole] = useState('candidate');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const activeRole = ROLES.find(r => r.id === selectedRole);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    // Mock API Call
    await new Promise(r => setTimeout(r, 1200));

    /* Uncomment when Auth is ready
    login({
      email,
      role: activeRole.name,
      id: selectedRole
    });
    */

    setLoading(false);
    navigate(activeRole.route);
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-neutral-light font-body">
      
      {/* ── LEFT PANEL: Branding ─────────────────────────── */}
      <div className="w-full md:w-1/2 bg-neutral-dark text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden order-2 md:order-1">
        {/* Subtle background pattern to keep it from being flat black */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <p className="font-mono text-xs tracking-widest uppercase text-accent mb-6 md:mb-10">
            CSAS · Candidate Alignment System
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            Go beyond the <br />
            <span className="text-gray-400 italic">CV.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Discover candidates based on real capability, not just keywords. A contextual intelligence layer that identifies qualified candidates traditional ATS systems discard.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL: Authentication ──────────────────── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 order-1 md:order-2">
        <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10 animate-fade-in-up">
          
          <div className="mb-8">
            <h2 className="font-display text-3xl text-neutral-dark tracking-tight mb-2">Sign in</h2>
            <p className="text-gray-500 text-sm">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            {/* 1. Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-8" role="radiogroup" aria-label="Select your role">
              {ROLES.map(({ id, name, desc, Icon }) => {
                const isActive = selectedRole === id;
                return (
                  <label 
                    key={id} 
                    className={`relative flex flex-col items-start p-4 rounded-xl border cursor-pointer transition-all duration-200 group focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2
                      ${isActive 
                        ? 'border-accent bg-cyan-50/50 shadow-sm' 
                        : 'border-border bg-white hover:border-gray-300 hover:bg-gray-50'}`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      value={id} 
                      checked={isActive} 
                      onChange={() => setSelectedRole(id)} 
                      className="sr-only" 
                    />
                    <Icon className={`w-6 h-6 mb-3 transition-colors ${isActive ? 'text-accent' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span className={`font-semibold text-sm mb-1 ${isActive ? 'text-neutral-dark' : 'text-gray-700'}`}>{name}</span>
                    <span className="text-xs text-gray-500 leading-snug">{desc}</span>
                    
                    {/* Active Indicator Dot */}
                    {isActive && (
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                    )}
                  </label>
                );
              })}
            </div>

            {/* 2. Credentials */}
            <div className="space-y-5 mb-8">
              
              {/* Email Input */}
              <div className="space-y-2">
                <label className="block font-mono text-xs tracking-wider uppercase text-gray-500" htmlFor="email">
                  Email Address
                </label>
                <input 
                  id="email" 
                  type="email" 
                  className={`w-full bg-white border rounded-lg px-4 py-3 text-neutral-dark outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-accent/20
                    ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-accent'}`}
                  placeholder="you@company.com" 
                  value={email} 
                  onChange={e => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ''});
                  }} 
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-mono text-xs tracking-wider uppercase text-gray-500" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    className={`w-full bg-white border rounded-lg pl-4 pr-12 py-3 text-neutral-dark outline-none transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-accent/20
                      ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-border focus:border-accent'}`}
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({...errors, password: ''});
                    }} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md focus:outline-none focus:ring-2 focus:ring-accent/50"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

            </div>

            {/* 3. CTA Button (Using your custom Button component) */}
            <Button 
              type="submit" 
              variant="primary" 
              size="lg" 
              isFullWidth 
              isLoading={loading}
            >
              Continue as {activeRole.name}
            </Button>
          </form>

          {/* 4. Footer Links */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <button className="text-gray-500 hover:text-neutral-dark transition-colors font-medium">
              Forgot password?
            </button>
            <div className="text-gray-500">
              Don't have an account?{' '}
              <button className="text-accent hover:text-cyan-600 font-semibold transition-colors">
                Sign up
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}