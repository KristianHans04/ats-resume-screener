import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/ui/Button';

export default function LoginView() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userData;
      if (isSignUp) {
        userData = await register(username, email, password, role);
      } else {
        userData = await login(username, password);
      }
      
      const userRole = userData?.role || role;
      navigate(userRole === 'RECRUITER' ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center p-4 font-body relative overflow-hidden transition-colors duration-300">
      
      {/* Theme Toggle (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-xl glass-card border dark:border-white/10 border-black/5 hover:border-accent transition-all duration-300"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-accent"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-accent"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </div>

      <div className="w-full max-w-[460px] animate-fade-in-up z-raised">
        
        {/* Brand Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/20 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-accent/30 mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8 text-accent" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-bold dark:text-white text-slate-900 mb-2 tracking-tight">CSAS Engine</h1>
          <p className="dark:text-gray-400 text-soft-slate text-sm">
            {isSignUp ? 'Join the next generation of recruitment' : 'Securely access your recruitment dashboard'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-2xl relative">
          {error && (
            <div className="mb-6 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold dark:text-gray-500 text-soft-slate uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-5 py-3.5 dark:bg-white/5 bg-black/[0.02] border dark:border-white/10 border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all text-sm dark:text-white text-slate-900 placeholder:dark:text-gray-600 placeholder:text-slate-300"
                placeholder="Enter your username"
              />
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono font-bold dark:text-gray-500 text-soft-slate uppercase tracking-widest ml-1">Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 dark:bg-white/5 bg-black/[0.02] border dark:border-white/10 border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all text-sm dark:text-white text-slate-900 placeholder:dark:text-gray-600 placeholder:text-slate-300"
                  placeholder="name@example.com"
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-mono font-bold dark:text-gray-500 text-soft-slate uppercase tracking-widest">Password</label>
                {!isSignUp && <a href="#" className="text-[10px] font-mono uppercase tracking-widest text-accent hover:text-cyan-400">Forgot?</a>}
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 dark:bg-white/5 bg-black/[0.02] border dark:border-white/10 border-black/5 rounded-xl focus:outline-none focus:ring-1 focus:ring-accent/40 focus:border-accent/40 transition-all text-sm dark:text-white text-slate-900 placeholder:dark:text-gray-600 placeholder:text-slate-300"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-3 mt-2">
                <label className="text-[10px] font-mono font-bold dark:text-gray-500 text-soft-slate uppercase tracking-widest ml-1">Select Your Path</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('CANDIDATE')}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${role === 'CANDIDATE' ? 'bg-accent/20 dark:text-white text-charcoal border-accent shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'dark:bg-white/5 bg-black/[0.02] dark:text-gray-500 text-soft-slate border-transparent dark:hover:bg-white/10 hover:bg-black/5'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('RECRUITER')}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300 ${role === 'RECRUITER' ? 'bg-accent/20 dark:text-white text-charcoal border-accent shadow-[0_0_15px_rgba(22,163,74,0.1)]' : 'dark:bg-white/5 bg-black/[0.02] dark:text-gray-500 text-soft-slate border-transparent dark:hover:bg-white/10 hover:bg-black/5'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Recruiter</span>
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4 shadow-xl" isLoading={loading}>
              {isSignUp ? 'Create My Account' : 'Authenticate Access'}
            </Button>
            
          </form>

          <div className="mt-10 pt-6 border-t dark:border-white/10 border-black/5 text-center">
            <p className="text-xs dark:text-gray-500 text-soft-slate">
              {isSignUp ? 'Already registered?' : "New to CSAS Engine?"}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="ml-2 font-bold text-accent hover:text-cyan-400 transition-colors underline underline-offset-4 decoration-accent/30"
              >
                {isSignUp ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
          
        </div>

        {/* System Footer */}
        <p className="mt-12 text-center font-mono text-[9px] tracking-[0.2em] uppercase dark:text-gray-600 text-soft-slate/40">
          Advanced Agentic Coding &bull; Version 2.4.0
        </p>
      </div>
    </div>
  );
}