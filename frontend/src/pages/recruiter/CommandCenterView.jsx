import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const MOCK_ROLES = [
  { id: 'role-001', name: 'Senior Backend Engineer', department: 'Engineering', candidates: 12, shortlisted: 3, avgScore: 0.74, status: 'active' },
  { id: 'role-002', name: 'Data Scientist', department: 'Analytics', candidates: 9, shortlisted: 2, avgScore: 0.69, status: 'active' },
  { id: 'role-003', name: 'Frontend Developer Intern', department: 'Web Development', candidates: 6, shortlisted: 2, avgScore: 0.71, status: 'active' }
];

const STATUS_LABEL = { active: 'Accepting', review: 'In Review', closed: 'Closed' };
const STATUS_DOT_COLORS = { active: 'bg-emerald-500', review: 'bg-orange-500', closed: 'bg-gray-400' };

export default function CommandCenterView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <p className="font-mono text-xs tracking-widest uppercase text-accent">Recruiter Portal</p>
        <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Command Centre</h1>
        <p className="text-sm text-gray-500">Platform health and candidate funnel overview.</p>
      </div>

      <section aria-label="Active roles" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest uppercase text-gray-500">Active Roles</span>
          <Button variant="primary" size="sm" onClick={() => navigate('/recruiter/create-job')}>
            + Post New Job
          </Button>
        </div>

        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-[1fr_80px_80px_100px_120px_auto] gap-4 p-4 px-6 bg-gray-50 border-b border-border">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Role</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Applied</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Listed</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Avg Score</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Status</span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 text-right">Action</span>
          </div>

          {MOCK_ROLES.map((role) => (
            <div key={role.id} className="grid grid-cols-1 md:grid-cols-[1fr_80px_80px_100px_120px_auto] items-center gap-4 p-4 px-6 border-b border-border hover:bg-gray-50 transition-colors">
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-neutral-dark truncate">{role.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mt-1">{role.department}</p>
              </div>
              <span className="font-mono text-sm text-gray-600"><span className="md:hidden text-xs mr-2">Applied:</span>{role.candidates}</span>
              <span className="font-mono text-sm text-gray-600"><span className="md:hidden text-xs mr-2">Shortlisted:</span>{role.shortlisted}</span>
              <span className="font-mono text-sm font-medium text-accent"><span className="md:hidden text-xs mr-2">Avg:</span>{role.avgScore.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[role.status]}`} />
                <span className="text-xs text-gray-500">{STATUS_LABEL[role.status]}</span>
              </div>
              <div className="flex justify-start md:justify-end">
                <Button variant="outline" size="sm" onClick={() => navigate('/recruiter/ranking-board')}>Rankings</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}