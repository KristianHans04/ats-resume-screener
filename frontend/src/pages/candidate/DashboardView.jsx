import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ApplicationCard from '../../components/candidate/ApplicationCard';
import Button from '../../components/ui/Button';

/* ── Icons ───────────────────────────────────────────────── */
const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 12C6 10.9 6.9 10 8 10H20L24 14H40C41.1 14 42 14.9 42 16V36C42 37.1 41.1 38 40 38H8C6.9 38 6 37.1 6 36V12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

export default function DashboardView() {
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

  const activeApps = applications.filter(a => !['REJECTED', 'WITHDRAWN'].includes(a.status));

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ── Page Header & Top Nav ──────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border">
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-widest uppercase text-accent">Candidate Portal</p>
            <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">My Applications</h1>
            <p className="text-sm text-gray-500">Track your active roles and pending inquiries.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" icon={PlusIcon} onClick={() => navigate('/candidate/apply')}>
              New Application
            </Button>
          </div>
        </header>

        {/* ── Active Applications ───────────────────────── */}
        <section aria-label="Active applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Active Roles</h2>
            <span className="font-mono text-xs text-gray-500 bg-gray-200 border border-border rounded-full px-3 py-0.5">
              {activeApps.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading && [1, 2].map(i => <ApplicationCard key={i} loading />)}

            {!loading && activeApps.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-16 text-center border border-dashed border-gray-300 rounded-2xl bg-white">
                <FolderIcon className="w-12 h-12 text-gray-300 mb-4" />
                <p className="font-display text-lg text-gray-600 mb-2">No active applications</p>
                <p className="text-sm text-gray-400 max-w-xs mb-6">Apply for a role to begin the semantic alignment process.</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/candidate/apply')}>
                  Browse Roles
                </Button>
              </div>
            )}

            {!loading && activeApps.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                onViewInquiry={() => navigate(`/candidate/inquiry/${app.id}`)}
                onViewSummary={() => navigate(`/candidate/history/${app.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}