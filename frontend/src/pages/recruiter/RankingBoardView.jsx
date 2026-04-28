import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import CandidateRankingRow from '../../components/recruiter/CandidateRankingRow';
import Button from '../../components/ui/Button';

// The Logical Categorization Algorithm
const getTier = (candidate) => {
  if (candidate.status === 'COMPLETED') return 2;  // Tier 2: Finished Inquiry
  if (candidate.status === 'AWAITING_INQUIRY') return 3; // Tier 3
  if (candidate.status === 'REJECTED') return 4;                                                                       // Tier 4
  return 1; // Default parsing/processing
};

export default function RankingBoardView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const endpoint = jobId ? `/jobs/jobs/${jobId}/applications/` : '/jobs/applications/';
        const data = await apiFetch(endpoint);
        setApplications(data);
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [jobId]);

  // Apply sorting algorithm
  const sortedCandidates = [...applications].map(app => ({
    id: app.id,
    name: app.candidate_username || 'Unknown Candidate',
    appliedRole: app.job_title || 'Unknown Role',
    appliedDate: app.created_at,
    resumeScore: app.resume_score || 0,
    finalScore: app.final_score || app.resume_score || 0,
    status: app.status,
    inquiryComplete: app.status === 'COMPLETED'
  })).sort((a, b) => {
    const tierA = getTier(a);
    const tierB = getTier(b);
    if (tierA !== tierB) return tierA - tierB; // Sort by tier groups first
    if (tierA === 2) return b.finalScore - a.finalScore; // Within Tier 2, sort highest final score first
    return b.resumeScore - a.resumeScore; // Otherwise sort by resume score
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">
      <div className="flex flex-col gap-2 pb-6 border-b border-border relative">
        {jobId && (
          <Button variant="ghost" size="sm" className="self-start -ml-3 mb-2" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Ranking Board</h1>
        <p className="text-sm text-gray-500">Applicants are prioritized dynamically based on Semantic Match and Inquiry Performance.</p>
      </div>

      <div className="flex flex-col bg-white border border-border rounded-xl shadow-sm p-4">
        {/* Render Header */}
        <CandidateRankingRow.Header />
        
        {/* Render Sorted Applicants */}
        <div className="flex flex-col gap-2 mt-2">
          {loading && <p className="p-4 text-center text-gray-500">Loading applicants...</p>}
          {!loading && sortedCandidates.length === 0 && <p className="p-4 text-center text-gray-500">No applicants found.</p>}
          {!loading && sortedCandidates.map((candidate, index) => (
            <CandidateRankingRow 
              key={candidate.id} 
              candidate={candidate} 
              rank={index + 1} 
              onViewProfile={() => navigate(`/recruiter/profiles/${candidate.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}