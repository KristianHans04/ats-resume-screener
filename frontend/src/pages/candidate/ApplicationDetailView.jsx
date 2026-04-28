import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

function toPercentage(value) {
  if (value === null || value === undefined) return '0%';
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

export default function ApplicationDetailView() {
  const navigate = useNavigate();
  const { appId } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await apiFetch(`/jobs/applications/${appId}/`);
        setApp(data);
      } catch (err) {
        console.error('Failed to fetch application details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [appId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-light font-body text-gray-500">Loading application details...</div>;
  }

  if (!app) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-light font-body gap-4">
      <p className="text-gray-500">Application not found.</p>
      <Button variant="outline" onClick={() => navigate('/candidate/history')}>Back to History</Button>
    </div>;
  }

  // Transform transcript data
  const transcript = (app.generated_questions || []).map((q, idx) => ({
    question: q.question || q,
    answer: app.answers ? app.answers[idx] : 'No response recorded'
  }));

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Button variant="ghost" size="sm" className="-ml-3" onClick={() => navigate('/candidate/history')}>
          ← Back to Application History
        </Button>

        {/* 1. Header Receipt */}
        <div className="bg-white border border-border p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">{app.company_name}</p>
            <h1 className="font-display text-2xl text-neutral-dark mb-2">{app.job_title}</h1>
            <p className="text-sm text-gray-500">Applied on {new Date(app.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusChip status={app.status} size="md" />
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
                <span className="text-gray-600">AI Match Score:</span>
                <span className="font-mono text-neutral-dark font-medium">{toPercentage(app.ai_score)}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Status</span>
                <span className="font-mono text-sm text-accent font-semibold">{app.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* 3. Semantic Gaps */}
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden md:col-span-2">
            <div className="bg-gray-50 p-4 border-b border-border">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Semantic Alignment Overview</h2>
            </div>
            <div className="p-6">
              {app.semantic_gaps && app.semantic_gaps.length > 0 ? (
                <ul className="space-y-3">
                  {app.semantic_gaps.map((gap, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${gap.matched || gap.is_met ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                      <span className="text-neutral-dark flex-1">{gap.requirement || gap.skill}</span>
                      <span className={`font-mono text-[10px] uppercase tracking-widest ${gap.matched || gap.is_met ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {gap.matched || gap.is_met ? 'Aligned' : 'Context Required'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">No semantic analysis available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* 4. Read-Only Transcript (Only renders if questions were asked) */}
        {transcript.length > 0 && (
          <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-border flex justify-between items-center">
              <h2 className="font-mono text-xs tracking-widest uppercase text-gray-500">Inquiry Transcript</h2>
              <span className="bg-cyan-50 text-accent font-mono text-[10px] uppercase px-2 py-1 rounded border border-cyan-100">Read Only</span>
            </div>
            <div className="p-6 space-y-6">
              {transcript.map((qa, i) => (
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