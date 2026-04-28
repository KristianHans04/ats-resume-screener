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
    <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="surface-divider flex flex-col gap-2 pb-6 border-b">
          <p className="font-mono text-xs tracking-widest uppercase text-accent">Candidate Records</p>
          <h1 className="page-heading font-display text-3xl md:text-4xl tracking-tight">Application History</h1>
          <p className="page-copy text-sm">View the status and semantic alignment results of all your past applications.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="table-head hidden md:grid grid-cols-[2fr_1.5fr_1fr_auto] gap-4 border-b p-4 px-6">
            <span className="font-mono text-[10px] tracking-widest uppercase">Role & Company</span>
            <span className="font-mono text-[10px] tracking-widest uppercase">Date Applied</span>
            <span className="font-mono text-[10px] tracking-widest uppercase">Status</span>
            <span className="font-mono text-[10px] tracking-widest uppercase">Action</span>
          </div>

          {/* List Items */}
          <div className="flex flex-col">
            {loading && <div className="page-copy p-8 text-center">Loading history...</div>}
            {!loading && applications.length === 0 && <div className="page-copy p-8 text-center">No applications found.</div>}
            {!loading && applications.map((app) => (
              <div key={app.id} className="table-row grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_auto] items-center gap-4 border-b p-4 px-6 last:border-b-0">
                
                <div className="flex flex-col">
                  <span className="page-heading font-semibold text-sm">{app.job_title}</span>
                  <span className="page-label font-mono text-[10px] uppercase tracking-widest mt-1">{app.company_name}</span>
                </div>

                <span className="page-copy text-sm">
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
