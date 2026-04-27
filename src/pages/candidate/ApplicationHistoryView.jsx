import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';

const MOCK_HISTORY = [
  { id: 'app-001', role: 'Software Engineer Intern', company: 'Safaricom PLC', date: '2026-03-20', status: 'inquiry-pending' },
  { id: 'app-002', role: 'Data Scientist', company: 'Kenya Revenue Authority', date: '2026-03-14', status: 'shortlisted' },
  { id: 'app-003', role: 'Frontend Developer', company: 'Andela', date: '2026-02-10', status: 'rejected' },
];

export default function ApplicationHistoryView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col gap-2 pb-6 border-b border-border">
          <p className="font-mono text-xs tracking-widest uppercase text-accent">Candidate Records</p>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Application History</h1>
          <p className="text-sm text-gray-500">View the status and semantic alignment results of all your past applications.</p>
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 p-4 px-6 bg-gray-50 border-b border-border">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Role & Company</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Date Applied</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Status</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Action</span>
          </div>

          {/* List Items */}
          <div className="flex flex-col">
            {MOCK_HISTORY.map((app) => (
              <div key={app.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto] items-center gap-4 p-4 px-6 border-b border-border last:border-b-0 hover:bg-gray-50 transition-colors">
                
                <div className="flex flex-col">
                  <span className="font-semibold text-neutral-dark text-sm">{app.role}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mt-1">{app.company}</span>
                </div>

                <span className="text-sm text-gray-600">
                  {new Date(app.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
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