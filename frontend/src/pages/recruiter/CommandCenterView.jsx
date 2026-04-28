import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';

const STATUS_LABEL = { active: 'Accepting', review: 'In Review', closed: 'Closed' };
const STATUS_DOT_COLORS = { active: 'bg-emerald-500', review: 'bg-orange-500', closed: 'bg-gray-400' };

export default function CommandCenterView() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoles() {
      try {
        // Since we don't have a specific recruiter-only endpoint, we just fetch jobs.
        // Ideally the backend filters this based on request.user.
        const data = await apiFetch('/jobs/jobs/');
        setRoles(data);
      } catch (err) {
        console.error('Error fetching roles', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">
      <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
        <p className="font-mono text-xs tracking-widest uppercase text-accent">Recruiter Portal</p>
        <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">Command Centre</h1>
        <p className="text-sm text-gray-400">Platform health and candidate funnel overview.</p>
      </div>

      <section aria-label="Active roles" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest uppercase text-gray-500">Active Roles</span>
          <Button variant="primary" size="sm" onClick={() => navigate('/recruiter/create-job')}>
            + Post New Job
          </Button>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-[1fr_80px_80px_100px_120px_auto] gap-4 p-4 px-6 bg-white/5 border-b border-white/5">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Role</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Applied</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Listed</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Avg Score</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Status</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 text-right">Action</span>
          </div>

          {loading && <div className="p-8 text-center text-gray-500">Loading roles...</div>}
          {!loading && roles.length === 0 && <div className="p-8 text-center text-gray-500">No active roles found. Post a new job!</div>}

          {!loading && roles.map((role) => (
            <div key={role.id} className="grid grid-cols-1 md:grid-cols-[1fr_80px_80px_100px_120px_auto] items-center gap-4 p-4 px-6 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-white truncate">{role.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-1">{role.department}</p>
              </div>
              {/* Dummy data for applied/shortlisted stats since the Job model might not aggregate this directly */}
              <span className="font-mono text-sm text-gray-600"><span className="md:hidden text-xs mr-2">Applied:</span>{role.applications?.length || 0}</span>
              <span className="font-mono text-sm text-gray-600"><span className="md:hidden text-xs mr-2">Shortlisted:</span>0</span>
              <span className="font-mono text-sm font-medium text-accent"><span className="md:hidden text-xs mr-2">Avg:</span>0.00</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS['active']}`} />
                <span className="text-xs text-gray-500">Accepting</span>
              </div>
              <div className="flex justify-start md:justify-end">
                {/* Ensure we navigate to the ranking board specifically for this job */}
                <Button variant="outline" size="sm" onClick={() => navigate(`/recruiter/ranking-board?jobId=${role.id}`)}>Rankings</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}