import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Register flow
        const user = await register(username, email, password, role);
        navigate(user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/command-center');
      } else {
        // Login flow
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
    <div className="min-h-screen w-full bg-neutral-light flex flex-col items-center justify-center p-4 font-body">
      <div className="w-full max-w-md animate-fade-in-up">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-border mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-accent" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h1 className="font-display text-3xl text-neutral-dark mb-2 tracking-tight">CSAS Engine</h1>
          <p className="text-gray-500 text-sm">
            {isSignUp ? 'Create a new account' : 'Sign in to access your portal'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-6 md:p-8">
          {error && (
            <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                required 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                placeholder="johndoe"
              />
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                  placeholder="name@example.com"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            {isSignUp && (
              <div className="flex flex-col gap-3 mt-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('CANDIDATE')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${role === 'CANDIDATE' ? 'bg-accent text-white border-accent shadow-md' : 'bg-white text-gray-500 border-border hover:bg-gray-50'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    <span className="text-sm font-medium">Candidate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('RECRUITER')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${role === 'RECRUITER' ? 'bg-accent text-white border-accent shadow-md' : 'bg-white text-gray-500 border-border hover:bg-gray-50'}`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                    <span className="text-sm font-medium">Recruiter</span>
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full mt-4" isLoading={loading}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button 
                onClick={() => setIsSignUp(!isSignUp)} 
                className="ml-2 font-medium text-accent hover:underline focus:outline-none"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}