import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';

export default function RoleDetailsView() {
  const navigate = useNavigate();
  const { roleId } = useParams(); 
  
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRole() {
      try {
        const data = await apiFetch(`/jobs/jobs/${roleId}/`);
        setRole(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, [roleId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (error || !role) {
    return (
      <div className="min-h-screen w-full bg-transparent flex flex-col items-center justify-center font-body">
        <h2 className="text-2xl text-white mb-4">Role Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/candidate/apply')}>Return to Job Feed</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-3xl mx-auto glass-card border border-white/10 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-8 md:p-10 border-b border-white/10 bg-white/5">
          <Button variant="ghost" size="sm" className="-ml-3 mb-6" onClick={() => navigate('/candidate/apply')}>
            ← Back to Roles
          </Button>
          <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">{role.company}</p>
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-4">{role.title}</h1>
          <div className="flex flex-wrap gap-3 font-mono text-xs text-gray-400">
            <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full">{role.location}</span>
            <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full">{role.employment_type}</span>
            <span className="bg-white/10 border border-white/10 px-3 py-1 rounded-full">{role.department}</span>
          </div>
        </div>

        {/* Job Description Content */}
        <div className="p-8 md:p-10 space-y-8 text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
          <section>
            <h2 className="font-display text-lg text-white mb-3">About the Role</h2>
            <p>{role.description}</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-white mb-3">Core Responsibilities</h2>
            <p>{role.responsibilities}</p>
          </section>

          <section>
            <h2 className="font-display text-lg text-white mb-3">Required Capabilities</h2>
            <p>{role.requirements}</p>
          </section>
        </div>

        {/* Action Footer */}
        <div className="p-8 md:p-10 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-white">Ready to apply?</h3>
            <p className="text-xs text-gray-500">You will need your resume in PDF format.</p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate(`/candidate/apply/${roleId}/upload`)}>
            Proceed to Upload Resume
          </Button>
        </div>

      </div>
    </div>
  );
}