import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';

function toPercentage(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

// Mock Database based on specific App ID
const MOCK_DETAILS = {
  'app-002': {
    role: 'Data Scientist',
    company: 'Kenya Revenue Authority',
    status: 'shortlisted',
    date: '2026-03-14',
    scores: { resume: 0.78, response: 0.84, final: 0.82 },
    gaps: [
      { skill: 'Python / Pandas', matched: true },
      { skill: 'SQL Optimization', matched: true },
      { skill: 'Model Deployment (API)', matched: false } // Required Inquiry
    ],
    transcript: [
      {
        question: "Your resume shows strong ML modeling experience but lacks details on production deployment. Can you describe how you would deploy a predictive model into a live environment?",
        answer: "In a previous project, after training our anomaly detection model in PySpark, I exported the model weights and wrapped them in a FastAPI application. I containerised the app using Docker and deployed it to an AWS EC2 instance, setting up basic endpoint authentication so the frontend could query predictions securely."
      }
    ]
  },
  'app-003': {
    role: 'Frontend Developer',
    company: 'Andela',
    status: 'rejected',
    date: '2026-02-10',
    scores: { resume: 0.32, response: null, final: 0.32 }, // Auto rejected, no inquiry
    gaps: [
      { skill: 'React.js', matched: true },
      { skill: 'TypeScript', matched: false },
      { skill: 'State Management (Redux/Zustand)', matched: false },
      { skill: 'CI/CD Pipelines', matched: false }
    ],
    transcript: []
  }
};

export default function ApplicationDetailView() {
  const navigate = useNavigate();
  const { appId } = useParams();

  const details = MOCK_DETAILS[appId] || MOCK_DETAILS['app-002']; // Default fallback for preview

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Button variant="ghost" size="sm" className="-ml-3" onClick={() => navigate('/candidate/history')}>
          ← Back to Application History
        </Button>

        {/* 1. Header Receipt */}
        <div className="bg-white border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">{details.company}</p>
            <h1 className="font-display text-2xl text-neutral-dark mb-2">{details.role}</h1>
            <p className="text-sm text-gray-500">Applied on {new Date(details.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusChip status={details.status} size="md" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* 2. Score Breakdown */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden md:col-span-1">
            <div className="bg-gray-50 p-4 border-b border-border">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Visibility Scores</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Resume Match:</span>
                <span className="font-mono text-neutral-dark font-medium">{toPercentage(details.scores.resume)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Response Quality:</span>
                <span className="font-mono text-neutral-dark font-medium">{details.scores.response ? toPercentage(details.scores.response) : 'N/A'}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Final Score</span>
                <span className="font-mono text-2xl text-accent font-semibold">{toPercentage(details.scores.final)}</span>
              </div>
            </div>
          </div>

          {/* 3. Semantic Gaps */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden md:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-border">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Semantic Alignment Overview</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {details.gaps.map((gap, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${gap.matched ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    <span className="text-neutral-dark flex-1">{gap.skill}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${gap.matched ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {gap.matched ? 'Aligned' : 'Context Required'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Read-Only Transcript (Only renders if questions were asked) */}
        {details.transcript.length > 0 && (
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Inquiry Transcript</h2>
              <span className="bg-cyan-50 text-accent font-mono text-[10px] uppercase px-2 py-1 rounded border border-cyan-100">Read Only</span>
            </div>
            <div className="p-6 space-y-6">
              {details.transcript.map((qa, i) => (
                <div key={i} className="space-y-3 p-4 bg-gray-50 border border-border rounded-xl">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">CSAS Engine Question</p>
                    <p className="text-sm text-neutral-dark bg-white p-3 rounded-lg border border-border">{qa.question}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-1 mt-3">Your Response</p>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-border opacity-90">{qa.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}