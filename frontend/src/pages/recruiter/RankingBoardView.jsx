import React from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateRankingRow from '../../components/recruiter/CandidateRankingRow';

const MOCK_APPLICANTS = [
  // Tier 1: Perfect CV Match (Auto Shortlisted, Bypassed Inquiry)
  { id: 'cand-001', name: 'Alice Smith', appliedRole: 'Senior Backend Engineer', appliedDate: '2026-03-22', resumeScore: 95, finalScore: 95, status: 'shortlisted', inquiryComplete: false },
  
  // Tier 2: Shortlisted Post-Inquiry (Needs to be sorted by Final Score)
  { id: 'cand-002', name: 'Joshua Ndirangu', appliedRole: 'Senior Backend Engineer', appliedDate: '2026-03-20', resumeScore: 64, responseScore: 91, finalScore: 81, status: 'shortlisted', inquiryComplete: true },
  { id: 'cand-003', name: 'Brian Kamau', appliedRole: 'Senior Backend Engineer', appliedDate: '2026-03-21', resumeScore: 70, responseScore: 80, finalScore: 76, status: 'shortlisted', inquiryComplete: true },
  
  // Tier 3: Pending Inquiry Room
  { id: 'cand-004', name: 'Ezekiel Wafula', appliedRole: 'Senior Backend Engineer', appliedDate: '2026-03-25', resumeScore: 72, finalScore: null, status: 'inquiry-pending', inquiryComplete: false },
  
  // Tier 4: Rejected (Either failed inquiry or bad CV)
  { id: 'cand-005', name: 'John Doe', appliedRole: 'Senior Backend Engineer', appliedDate: '2026-03-26', resumeScore: 30, finalScore: 30, status: 'rejected', inquiryComplete: false },
];

// The Logical Categorization Algorithm
const getTier = (candidate) => {
  if (candidate.status === 'shortlisted' && !candidate.inquiryComplete) return 1; // Tier 1
  if (candidate.status === 'shortlisted' && candidate.inquiryComplete) return 2;  // Tier 2
  if (candidate.status === 'inquiry-pending') return 3;                           // Tier 3
  return 4;                                                                       // Tier 4
};

export default function RankingBoardView() {
  const navigate = useNavigate();

  // Apply sorting algorithm
  const sortedCandidates = [...MOCK_APPLICANTS].sort((a, b) => {
    const tierA = getTier(a);
    const tierB = getTier(b);
    if (tierA !== tierB) return tierA - tierB; // Sort by tier groups first
    if (tierA === 2) return b.finalScore - a.finalScore; // Within Tier 2, sort highest final score first
    return 0;
  });

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full p-4 md:p-8 animate-fade-in-up">
      <div className="flex flex-col gap-2 pb-6 border-b border-border">
        <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Ranking Board</h1>
        <p className="text-sm text-gray-500">Applicants are prioritized dynamically based on Semantic Match and Inquiry Performance.</p>
      </div>

      <div className="flex flex-col bg-white border border-border rounded-xl shadow-sm p-4">
        {/* Render Header */}
        <CandidateRankingRow.Header />
        
        {/* Render Sorted Applicants */}
        <div className="flex flex-col gap-2 mt-2">
          {sortedCandidates.map((candidate, index) => (
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