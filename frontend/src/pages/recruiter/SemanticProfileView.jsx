import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ProgressBar from '../../components/ui/ProgressBar';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';

/* ── Icons ───────────────────────────────────────────────── */
const BackIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
    <path d="M11 7H3M6 4L3 7L6 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60">
    <rect x="1" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M1 5H11" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M4 1V3M8 1V3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

const RoleIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 opacity-60">
    <rect x="1" y="3" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.1"/>
    <path d="M4 3V2C4 1.45 4.45 1 5 1H7C7.55 1 8 1.45 8 2V3" stroke="currentColor" strokeWidth="1.1"/>
  </svg>
);

/* ── Component ───────────────────────────────────────────── */
export default function SemanticProfileView() {
  const navigate = useNavigate();
  const { candidateId } = useParams();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiFetch(`/jobs/applications/${candidateId}/`);
        
        // Transform backend data to match UI expectations
        // Backend provides: semantic_gaps (array or object), generated_questions, answers, resume_score, final_score
        const gaps = data.semantic_gaps || {};
        const gapEntries = Array.isArray(gaps)
          ? gaps.map(g => [g.skill || g.name || 'Unknown', g.similarity || g.score || 0])
          : Object.entries(gaps);

        const requirements = gapEntries.map(([skill, sim]) => {
          let status = 'high';
          if (sim < 0.4) status = 'critical';
          else if (sim < 0.6) status = 'gap';
          else if (sim < 0.8) status = 'medium';
          
          return {
            skill,
            similarity: sim * 100,
            status
          };
        });

        const inquiries = (data.generated_questions || []).map((q, i) => {
          const qText = q.question || q.text || q;
          const qId = q.id || i;
          const qGap = q.gap || `Requirement ${i+1}`;
          const ansObj = (data.answers || []).find(a => a.question_id === qId);
          return {
            id: qId,
            gap: qGap,
            question: qText,
            answer: ansObj ? (typeof ansObj === 'string' ? ansObj : ansObj.answer) : 'Pending answer...',
            responseScore: ansObj && ansObj.score ? ansObj.score * 100 : 0
          };
        });

        // XAI reasons - mock for now since backend doesn't explicitly return an array of strings
        // We'll just generate one based on the final score.
        const xaiReasons = [
          { type: 'neutral', text: `Initial resume semantic match score: ${data.resume_score || 0}%` },
          { type: 'neutral', text: `Final AI adjusted score after evaluating answers: ${data.final_score || data.resume_score || 0}%` }
        ];

        setCandidate({
          id: data.id,
          name: data.candidate_username || 'Unknown',
          initials: (data.candidate_username || 'U').substring(0, 2).toUpperCase(),
          appliedRole: data.job_title || 'Unknown Role',
          company: 'Company',
          appliedDate: data.created_at,
          status: data.status,
          resumeScore: data.resume_score || 0,
          responseScore: data.final_score ? data.final_score : 0, 
          finalScore: data.final_score || data.resume_score || 0,
          requirements,
          inquiries,
          xaiReasons
        });
      } catch (err) {
        console.error('Failed to fetch candidate profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [candidateId]);

  const handleShortlist = async () => {
    try {
      await apiFetch(`/jobs/applications/${candidateId}/shortlist/`, { method: 'POST' });
      navigate('/recruiter/ranking-board');
    } catch (err) {
      console.error('Failed to shortlist candidate', err);
    }
  };

  const handleReject = async () => {
    try {
      await apiFetch(`/jobs/applications/${candidateId}/reject/`, { method: 'POST' });
      navigate('/recruiter/ranking-board');
    } catch (err) {
      console.error('Failed to reject candidate', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-body text-gray-400 bg-transparent">Loading profile...</div>;
  if (!candidate) return <div className="min-h-screen flex items-center justify-center font-body text-gray-400 bg-transparent">Profile not found.</div>;

  const resumeSegment = Math.round(candidate.resumeScore * 0.4);
  const responseSegment = Math.round(candidate.responseScore * 0.6);

  const bulletColors = {
    positive: 'bg-emerald-500',
    neutral: 'bg-orange-400',
    negative: 'bg-red-500',
  };

  const gapBorderColors = {
    high: 'border-l-emerald-400',
    medium: 'border-l-accent',
    gap: 'border-l-orange-400',
    critical: 'border-l-red-400',
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in-up pb-12 bg-transparent">
      
      {/* ── Back navigation ── */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="self-start -ml-2">
        ← Back
      </Button>

      {/* ── Candidate header card ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start p-6 glass-card border border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center font-mono text-xl font-bold shrink-0 shadow-sm border-2 border-white/10" aria-hidden="true">
            {candidate.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-display text-2xl text-white tracking-tight truncate">{candidate.name}</h1>
            <p className="text-sm text-gray-400">{candidate.appliedRole}</p>
            <div className="flex items-center gap-4 flex-wrap mt-3">
              <span className="flex items-center gap-2 font-mono text-xs text-gray-500"><RoleIcon /> {candidate.company}</span>
              <span className="flex items-center gap-2 font-mono text-xs text-gray-500">
                <CalendarIcon /> Applied {new Date(candidate.appliedDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <StatusChip status={candidate.status} size="sm" />
            </div>
          </div>
        </div>

        {/* S_final score */}
        <div className="flex flex-col md:items-end gap-2 shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 w-full md:w-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">S_final Score</span>
            <span className="font-mono text-4xl font-medium text-accent leading-none tracking-tight tabular-nums" aria-label={`Final visibility score: ${candidate.finalScore}`}>
              {(candidate.finalScore / 100).toFixed(2)}
            </span>
          </div>
          <div className="w-full md:w-[220px] mt-2">
            <ProgressBar variant="stacked" resumeScore={resumeSegment} responseScore={responseSegment} label="Score Composition" showLegend size="sm" />
          </div>
        </div>
      </div>

      {/* ── Three-column body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Column 1 — Semantic Gap Highlighter */}
        <section className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-sm" aria-label="Semantic gap analysis">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Semantic Gap Analysis</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {candidate.requirements.length === 0 && <p className="text-sm text-gray-500">No gap analysis available.</p>}
            {candidate.requirements.map(req => (
              <div key={req.skill} className={`flex flex-col gap-3 p-4 bg-white/5 border border-white/10 rounded-xl border-l-[3px] ${gapBorderColors[req.status]}`}>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-medium text-white">{req.skill}</span>
                  <StatusChip status={req.status} label={(req.similarity/100).toFixed(2)} size="sm" dot={false} />
                </div>
                <ProgressBar value={req.similarity} variant="semantic" size="xs" threshold thresholdValue={60} thresholdBelow />
                {(req.status === 'gap' || req.status === 'critical') && (
                  <p className="text-xs text-gray-500 italic leading-relaxed mt-1">
                    {req.status === 'critical' ? 'Critical gap — inquiry response was weighted heavily in final score.' : 'Below threshold — inquiry question was generated for this requirement.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Column 2 — Inquiry Transcript */}
        <section className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-sm lg:col-span-2" aria-label="Inquiry transcript">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Inquiry Transcript</h2>
          </div>
          <div className="p-5 flex flex-col gap-6">
            {candidate.inquiries.length === 0 && <p className="text-sm text-gray-500">No inquiries generated for this candidate.</p>}
            {candidate.inquiries.map((item, i) => (
              <div key={item.id} className="flex flex-col gap-4 p-5 bg-white/5 border border-white/10 rounded-xl">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Question {i + 1} · {item.gap}</p>
                  <p className="text-sm text-white leading-relaxed pl-3 border-l-2 border-l-accent bg-white/5 p-3 rounded-r-lg shadow-sm border border-white/10">{item.question}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-2">Candidate Response</p>
                  <p className="text-sm text-gray-400 leading-relaxed bg-white/5 p-4 rounded-lg shadow-sm border border-white/10">{item.answer}</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/10 mt-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Response Quality</span>
                  <span className="font-mono text-sm font-medium text-accent">{(item.responseScore/100).toFixed(2)}</span>
                  <div className="flex-1 max-w-[200px]">
                    <ProgressBar value={item.responseScore} variant="semantic" size="xs" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Column 3 — XAI Reasoning (Full Width Bottom Panel) */}
      <section className="glass-card border border-white/10 rounded-2xl overflow-hidden shadow-sm" aria-label="AI reasoning explanation">
        <div className="p-4 bg-white/5 border-b border-white/10">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Score Reasoning (XAI)</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidate.xaiReasons.map((reason, i) => (
            <div key={i} className="flex gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-sm leading-relaxed text-gray-400">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${bulletColors[reason.type]}`} aria-hidden="true" />
              <p>{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Decision bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 glass-card border border-white/10 rounded-2xl shadow-sm mt-4" role="region" aria-label="Recruiter decision">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Recruiter Decision</span>
          <p className="font-display text-xl text-white">Proceed with {candidate.name}?</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="danger" size="md" isFullWidth className="sm:w-auto" onClick={handleReject}>
            Reject
          </Button>
          <Button variant="primary" size="md" isFullWidth className="sm:w-auto" onClick={handleShortlist}>
            Confirm Shortlist
          </Button>
        </div>
      </div>

    </div>
  );
}