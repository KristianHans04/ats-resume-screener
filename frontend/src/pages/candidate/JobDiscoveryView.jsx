import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';

/* ── Icons ── */
const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C11 11 13 8.82843 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 8.82843 5 11 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function JobDiscoveryView() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await apiFetch('/jobs/jobs/');
        setJobs(data);
      } catch (err) {
        console.error('Failed to fetch jobs', err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-2 pb-6 border-b border-border">
          <p className="font-mono text-xs tracking-widest uppercase text-accent">Career Portal</p>
          <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Open Roles</h1>
          <p className="text-sm text-gray-500">Discover and apply for opportunities perfectly matched to your capabilities.</p>
        </div>

        {/* Job Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading && <p className="text-gray-500">Loading open roles...</p>}
          {!loading && jobs.length === 0 && <p className="text-gray-500">No open roles available right now.</p>}
          {!loading && jobs.map((role) => (
            <div 
              key={role.id} 
              className="flex flex-col bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group" 
              onClick={() => navigate(`/candidate/apply/${role.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-1">{role.company}</p>
                  <h3 className="font-display text-xl text-neutral-dark group-hover:text-accent transition-colors">{role.title}</h3>
                </div>
                {role.application_status ? (
                  <span className={`font-mono text-[10px] tracking-widest uppercase px-2 py-1 rounded-md border ${
                    role.application_status === 'COMPLETED' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                    role.application_status === 'FAILED' ? 'text-red-600 bg-red-50 border-red-100' :
                    'text-orange-600 bg-orange-50 border-orange-100'
                  }`}>
                    {role.application_status.replace('_', ' ')}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] tracking-widest uppercase text-accent bg-cyan-50 px-2 py-1 rounded-md border border-cyan-100">
                    New Match
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5"><MapPinIcon /> {role.location}</span>
                <span className="flex items-center gap-1.5"><ClockIcon /> {role.employment_type}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-border flex justify-end">
                <Button 
                  variant={role.application_status ? "primary" : "outline"}
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (role.application_status === 'AWAITING_INQUIRY') {
                      navigate(`/candidate/inquiry/${role.application_id}`); 
                    } else if (role.application_status) {
                      navigate(`/candidate/history/${role.application_id}`);
                    } else {
                      navigate(`/candidate/apply/${role.id}`);
                    }
                  }}
                >
                  {role.application_status ? (
                    role.application_status === 'AWAITING_INQUIRY' ? 'Resume Application' : 'View Status'
                  ) : 'View Role'}
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}