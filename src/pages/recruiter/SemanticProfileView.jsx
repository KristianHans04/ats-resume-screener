import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

/* ── Mock data ───────────────────────────────────────────── */
const MOCK_CANDIDATE = {
  id: 'cand-001',
  name: 'Joshua Ndirangu',
  initials: 'JN',
  appliedRole: 'Senior Backend Engineer',
  company: 'Safaricom PLC',
  appliedDate: '2026-03-20',
  status: 'shortlisted',
  resumeScore: 64,
  responseScore: 91,
  finalScore: 81,
  requirements: [
    { skill: 'Python / FastAPI', similarity: 0.88, status: 'high' },
    { skill: 'PostgreSQL / Data Modeling', similarity: 0.79, status: 'high' },
    { skill: 'RESTful API Design', similarity: 0.73, status: 'medium' },
    { skill: 'Kubernetes Orchestration', similarity: 0.42, status: 'gap' },
    { skill: 'System Design at Scale', similarity: 0.51, status: 'gap' },
    { skill: 'CI/CD Pipeline Ownership', similarity: 0.38, status: 'critical' },
  ],
  inquiries: [
    { id: 'q1', gap: 'Kubernetes Orchestration', question: 'Your CV references Docker-based deployments. Can you describe how you managed containerised workloads, including any orchestration challenges?', answer: 'At my previous role at Andela, I managed 12 microservices using Docker Compose for local development and orchestrated staging deployments via a shared EC2 cluster. While we did not use Kubernetes directly, I was responsible for writing service manifests, managing inter-service communication through an NGINX reverse proxy, and debugging container networking issues. I am currently self-studying Kubernetes and have completed the CKA preparation coursework.', responseScore: 0.82 },
    { id: 'q2', gap: 'System Design at Scale', question: 'Walk us through the architecture of your payment integration project, focusing on load distribution and fault tolerance.', answer: 'The M-Pesa STK push integration handled peak volumes of approximately 800 concurrent requests during payroll periods. I implemented an async queue using Celery and Redis to decouple the payment request from the callback handling, preventing timeout failures. The database writes used optimistic locking to prevent race conditions on wallet balance updates. We ran three application replicas behind an ALB with health checks and used circuit breakers on the M-Pesa API client to handle their occasional downtime gracefully.', responseScore: 0.94 },
    { id: 'q3', gap: 'CI/CD Pipeline Ownership', question: 'Describe your specific contribution to any automated build or release processes.', answer: 'I contributed to our GitHub Actions pipeline by writing the test and Docker build stages. A senior engineer owned the deployment stage to production. I set up branch protection rules and required status checks so all PRs ran linting and unit tests before merge. I have not owned a full pipeline end-to-end but I have strong familiarity with the tooling — GitHub Actions, Docker buildx, and basic AWS CodePipeline concepts.', responseScore: 0.76 },
  ],
  xaiReasons: [
    { type: 'positive', text: 'Strong alignment on core backend competencies (Python, PostgreSQL, REST APIs) — all above the τ = 0.6 threshold without requiring inquiry.' },
    { type: 'positive', text: 'Exceptional response quality on the system design question (0.94) — the payment system architecture demonstrates concrete distributed systems thinking directly applicable to this role.' },
    { type: 'neutral', text: 'Kubernetes gap is real but the candidate demonstrated awareness and active upskilling. The Kubernetes inquiry response bridged the gap meaningfully (0.82).' },
    { type: 'negative', text: 'CI/CD ownership is shallow — candidate was honest about not owning a pipeline end-to-end. Response quality (0.76) reflects this limitation accurately.' },
    { type: 'neutral', text: 'Overall S_final of 0.81 places this candidate in the top 25% of applicants for this role based on the current cohort average of 0.74.' },
  ],
};

/* ── Component ───────────────────────────────────────────── */
export default function SemanticProfileView() {
  const navigate = useNavigate();
  const { candidateId } = useParams();

  const candidate = MOCK_CANDIDATE;
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
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full animate-fade-in-up pb-12">
      
      {/* ── Back navigation ── */}
      <Button variant="ghost" size="sm" leftIcon={<BackIcon />} onClick={() => navigate('/recruiter/ranking-board')} className="self-start -ml-2">
        Back to Ranking Board
      </Button>

      {/* ── Candidate header card ── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-start p-6 bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-neutral-dark text-white flex items-center justify-center font-mono text-xl font-bold shrink-0 shadow-sm border-2 border-border" aria-hidden="true">
            {candidate.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="font-display text-2xl text-neutral-dark tracking-tight truncate">{candidate.name}</h1>
            <p className="text-sm text-gray-500">{candidate.appliedRole}</p>
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
        <div className="flex flex-col md:items-end gap-2 shrink-0 bg-gray-50 p-4 rounded-xl border border-border w-full md:w-auto">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">S_final Score</span>
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
        <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm" aria-label="Semantic gap analysis">
          <div className="p-4 bg-gray-50 border-b border-border">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Semantic Gap Analysis</h2>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {candidate.requirements.map(req => (
              <div key={req.skill} className={`flex flex-col gap-3 p-4 bg-gray-50 border border-border rounded-xl border-l-[3px] ${gapBorderColors[req.status]}`}>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-medium text-neutral-dark">{req.skill}</span>
                  <StatusChip status={req.status} label={req.similarity.toFixed(2)} size="sm" dot={false} />
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
        <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm lg:col-span-2" aria-label="Inquiry transcript">
          <div className="p-4 bg-gray-50 border-b border-border">
            <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Inquiry Transcript</h2>
          </div>
          <div className="p-5 flex flex-col gap-6">
            {candidate.inquiries.map((item, i) => (
              <div key={item.id} className="flex flex-col gap-4 p-5 bg-gray-50 border border-border rounded-xl">
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Question {i + 1} · {item.gap}</p>
                  <p className="text-sm text-neutral-dark leading-relaxed pl-3 border-l-2 border-l-accent bg-white p-3 rounded-r-lg shadow-sm border border-border">{item.question}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-2">Candidate Response</p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-border">{item.answer}</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border mt-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Response Quality</span>
                  <span className="font-mono text-sm font-medium text-accent">{item.responseScore.toFixed(2)}</span>
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
      <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm" aria-label="AI reasoning explanation">
        <div className="p-4 bg-gray-50 border-b border-border">
          <h2 className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Score Reasoning (XAI)</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidate.xaiReasons.map((reason, i) => (
            <div key={i} className="flex gap-3 p-4 bg-gray-50 border border-border rounded-xl text-sm leading-relaxed text-gray-600">
              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${bulletColors[reason.type]}`} aria-hidden="true" />
              <p>{reason.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Decision bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white border border-border rounded-2xl shadow-sm mt-4" role="region" aria-label="Recruiter decision">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">Recruiter Decision</span>
          <p className="font-display text-xl text-neutral-dark">Proceed with {candidate.name}?</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="danger" size="md" isFullWidth className="sm:w-auto" onClick={() => navigate('/recruiter/ranking-board')}>
            Reject
          </Button>
          <Button variant="primary" size="md" isFullWidth className="sm:w-auto" onClick={() => navigate('/recruiter/ranking-board')}>
            Confirm Shortlist
          </Button>
        </div>
      </div>

    </div>
  );
}