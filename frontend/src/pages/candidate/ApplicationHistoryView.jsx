import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

export default function ApplicationHistoryView() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const data = await apiFetch('/jobs/applications/');
        setApplications(data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col gap-2 pb-6 border-b border-white/10">
          <p className="font-mono text-xs tracking-widest uppercase text-accent">Candidate Records</p>
          <h1 className="font-display text-3xl md:text-4xl text-white tracking-tight">Application History</h1>
          <p className="text-sm text-gray-400">View the status and semantic alignment results of all your past applications.</p>
        </div>

        <div className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 p-4 px-6 bg-white/5 border-b border-white/10">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Role & Company</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Date Applied</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Status</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Action</span>
          </div>

          {/* List Items */}
          <div className="flex flex-col">
            {loading && <div className="p-8 text-center text-gray-400">Loading history...</div>}
            {!loading && applications.length === 0 && <div className="p-8 text-center text-gray-400">No applications found.</div>}
            {!loading && applications.map((app) => (
              <div key={app.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_auto] items-center gap-4 p-4 px-6 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                
                <div className="flex flex-col">
                  <span className="font-semibold text-white text-sm">{app.job_title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-1">{app.company_name}</span>
                </div>

                <span className="text-sm text-gray-400">
                  {new Date(app.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>

                <div>
                  <StatusChip status={app.status} size="sm" />
                </div>

                <div className="mt-2 md:mt-0">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/candidate/history/${app.id}`)}>
                    View Details
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}