import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch, apiFetchBlob } from '../../utils/api';
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
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiFetch(`/jobs/applications/${candidateId}/`);
        
        // Transform semantic gaps
        const gaps = data.semantic_gaps || [];
        const gapEntries = Array.isArray(gaps)
          ? gaps.map(g => [g.skill || g.name || 'Unknown', g.similarity || g.score || 0])
          : Object.entries(gaps);

        const requirements = gapEntries.map(([skill, sim]) => {
          const simValue = typeof sim === 'number' ? sim : 0;
          let status = 'high';
          if (simValue < 0.4) status = 'critical';
          else if (simValue < 0.6) status = 'gap';
          else if (simValue < 0.8) status = 'medium';
          
          return {
            skill,
            similarity: simValue * 100,
            status
          };
        });

        // Transform inquiries — match answers by question_id
        const inquiries = (data.generated_questions || []).map((q, i) => {
          const qText = q.question || q.text || q;
          const qId = q.id || i;
          const qGap = q.gap || `Requirement ${i+1}`;
          const answers = data.answers || [];
          const ansObj = answers.find(a => a.question_id === qId) || answers[i];
          return {
            id: qId,
            gap: qGap,
            question: qText,
            answer: ansObj ? (typeof ansObj === 'string' ? ansObj : ansObj.answer || ansObj.text || 'Pending answer...') : 'Pending answer...',
            responseScore: ansObj && ansObj.score ? ansObj.score * 100 : 0
          };
        });

        const displayName = data.full_name || data.candidate_username || 'Unknown';

        setCandidate({
          id: data.id,
          name: displayName,
          initials: displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          email: data.email || '',
          phone: data.phone || '',
          appliedRole: data.job_title || 'Unknown Role',
          company: data.company_name || 'Company',
          appliedDate: data.created_at,
          status: data.status,
          classification: data.classification,
          rejectionReason: data.rejection_reason,
          resumeScore: data.resume_score || 0,
          finalScore: data.final_score || data.ai_score || data.resume_score || 0,
          aiScore: data.ai_score || 0,
          requirements,
          inquiries,
        });

        // Try to load resume preview
        try {
          const url = await apiFetchBlob(`/jobs/applications/${candidateId}/resume/`);
          setResumeUrl(url);
        } catch (e) {
          console.log('Could not load resume preview');
        }
      } catch (err) {
        console.error('Failed to fetch candidate profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();

    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
    };
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

  if (loading) return <div className="page-copy min-h-screen flex items-center justify-center font-body bg-transparent">Loading profile...</div>;
  if (!candidate) return <div className="page-copy min-h-screen flex items-center justify-center font-body bg-transparent">Profile not found.</div>;

  const gapBorderColors = {
    high: 'border-l-emerald-400',
    medium: 'border-l-accent',
    gap: 'border-l-orange-400',
    critical: 'border-l-red-400',
  };

  return (
    <div className="page-shell flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in-up pb-12 bg-transparent">
      
      {/* ── Back navigation ── */}
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="self-start -ml-2">
        ← Back
      </Button>

      {/* ── Candidate header card ── */}
      <div className="glass-card grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="surface-subtle page-heading flex h-14 w-14 items-center justify-center rounded-full border-2 font-mono text-xl font-bold shrink-0 shadow-sm" aria-hidden="true">
            {candidate.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="page-heading font-display text-2xl tracking-tight truncate">{candidate.name}</h1>
            <p className="page-copy text-sm">{candidate.appliedRole}</p>
            <div className="flex items-center gap-4 flex-wrap mt-3">
              <span className="page-label flex items-center gap-2 font-mono text-xs"><RoleIcon /> {candidate.company}</span>
              <span className="page-label flex items-center gap-2 font-mono text-xs">
                <CalendarIcon /> Applied {new Date(candidate.appliedDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <StatusChip status={candidate.status} size="sm" />
            </div>
            {/* Contact Info */}
            <div className="flex items-center gap-4 flex-wrap mt-2">
              {candidate.email && (
                <span className="page-label font-mono text-xs">✉ {candidate.email}</span>
              )}
              {candidate.phone && (
                <span className="page-label font-mono text-xs">☎ {candidate.phone}</span>
              )}
            </div>
          </div>
        </div>

        {/* AI Score */}
        <div className="surface-subtle flex flex-col md:items-end gap-2 shrink-0 p-4 rounded-xl w-full md:w-auto">
          <div className="flex items-baseline gap-2">
            <span className="page-label font-mono text-[10px] tracking-widest uppercase">AI Score</span>
            <span className="font-mono text-4xl font-medium text-accent leading-none tracking-tight tabular-nums" aria-label={`AI Score: ${Math.round(candidate.aiScore)}%`}>
              {Math.round(candidate.aiScore)}%
            </span>
          </div>
          <div className="w-full md:w-[220px] mt-2">
            <ProgressBar value={candidate.aiScore} variant="semantic" label="AI Match Score" size="sm" showValue />
          </div>
        </div>
      </div>

      {/* ── Rejection reason (if applicable) ── */}
      {candidate.rejectionReason && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
          <h2 className="font-mono text-xs tracking-widest uppercase text-red-600 dark:text-red-400 mb-2">AI Rejection Reason</h2>
          <p className="text-sm text-red-700 dark:text-red-300">{candidate.rejectionReason}</p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-mono">Classification: {candidate.classification}</p>
        </div>
      )}

      {/* ── Three-column body ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Column 1 — Semantic Gap Highlighter */}
        <section className="glass-card rounded-2xl overflow-hidden shadow-sm" aria-label="Semantic gap analysis">
          <div className="table-head border-b p-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase">Semantic Gap Analysis</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {candidate.requirements.length === 0 && <p className="page-copy text-sm">No gap analysis available.</p>}
            {candidate.requirements.map(req => (
              <div key={req.skill} className={`surface-subtle flex flex-col gap-3 rounded-xl p-4 border-l-[3px] ${gapBorderColors[req.status]}`}>
                <div className="flex justify-between items-center gap-2">
                  <span className="page-heading text-sm font-medium">{req.skill}</span>
                  <StatusChip status={req.status} label={(req.similarity/100).toFixed(2)} size="sm" dot={false} />
                </div>
                <ProgressBar value={req.similarity} variant="semantic" size="xs" threshold thresholdValue={60} thresholdBelow />
                {(req.status === 'gap' || req.status === 'critical') && (
                  <p className="page-copy text-xs italic leading-relaxed mt-1">
                    {req.status === 'critical' ? 'Critical gap — inquiry response was weighted heavily in final score.' : 'Below threshold — inquiry question was generated for this requirement.'}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Column 2 — Inquiry Transcript */}
        <section className="glass-card rounded-2xl overflow-hidden shadow-sm lg:col-span-2" aria-label="Inquiry transcript">
          <div className="table-head border-b p-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase">Inquiry Transcript</h2>
          </div>
          <div className="p-5 flex flex-col gap-6">
            {candidate.inquiries.length === 0 && <p className="page-copy text-sm">No inquiries generated for this candidate.</p>}
            {candidate.inquiries.map((item, i) => (
              <div key={item.id} className="surface-subtle flex flex-col gap-4 rounded-xl p-5">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Question {i + 1} · {item.gap}</p>
                  <p className="surface-subtle page-heading rounded-r-lg border-l-2 border-l-accent p-3 pl-3 text-sm leading-relaxed">{item.question}</p>
                </div>
                <div>
                  <p className="page-label font-mono text-[10px] tracking-widest uppercase mb-2">Candidate Response</p>
                  <p className="surface-subtle page-copy rounded-lg p-4 text-sm leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Resume Preview ── */}
      {resumeUrl && (
        <section className="glass-card rounded-2xl overflow-hidden shadow-sm" aria-label="Resume preview">
          <div className="table-head flex items-center justify-between border-b p-4">
            <h2 className="font-mono text-[10px] tracking-widest uppercase">Resume / CV</h2>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-accent font-mono text-xs hover:underline">
              Open in new tab ↗
            </a>
          </div>
          <div className="p-4">
            <iframe src={resumeUrl} className="w-full h-[600px] rounded-lg border border-white/10" title="Resume Preview" />
          </div>
        </section>
      )}

      {/* ── Decision bar ── */}
      {candidate.status !== 'SHORTLISTED' && candidate.status !== 'REJECTED' && (
        <div className="glass-card mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl p-6 shadow-sm" role="region" aria-label="Recruiter decision">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <span className="page-label font-mono text-[10px] tracking-widest uppercase">Recruiter Decision</span>
            <p className="page-heading font-display text-xl">Proceed with {candidate.name}?</p>
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
      )}

      {/* Already decided indicator */}
      {(candidate.status === 'SHORTLISTED' || candidate.status === 'REJECTED') && (
        <div className="glass-card mt-4 flex items-center justify-center gap-4 rounded-2xl p-6 shadow-sm">
          <StatusChip status={candidate.status} size="md" />
          <span className="page-copy text-sm">Decision has been made for this candidate.</span>
        </div>
      )}

    </div>
  );
}
