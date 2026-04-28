import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StatusChip from '../../components/ui/StatusChip';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

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
    return <div className="page-copy min-h-screen flex items-center justify-center bg-transparent font-body">Loading application details...</div>;
  }

  if (!app) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-transparent font-body gap-4">
      <p className="page-copy">Application not found.</p>
      <Button variant="outline" onClick={() => navigate('/candidate/history')}>Back to History</Button>
    </div>;
  }

  // Transform transcript data - standardize answer field name
  const transcript = (app.generated_questions || []).map((q, idx) => {
    const qText = typeof q === 'string' ? q : (q.question || q.text || q);
    const answers = app.answers || [];
    // Match by question_id or fall back to index
    const qId = q.id || idx;
    const ans = answers.find(a => a.question_id === qId) || answers[idx];
    const ansText = ans ? (typeof ans === 'string' ? ans : ans.answer || ans.text || 'No response recorded') : 'No response recorded';
    return { question: qText, answer: ansText };
  });

  const failureReason = app.status === 'FAILED'
    ? app.rejection_reason || 'This application could not be processed successfully. Please return to the role page and submit it again.'
    : null;

  return (
    <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Button variant="ghost" size="sm" className="-ml-3" onClick={() => navigate('/candidate/history')}>
          ← Back to Application History
        </Button>

        {/* 1. Header Receipt */}
        <div className="glass-card rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">{app.company_name}</p>
            <h1 className="page-heading font-display text-2xl mb-2">{app.job_title}</h1>
            <p className="page-copy text-sm">Applied on {new Date(app.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusChip status={app.status} size="md" />
          </div>
        </div>

        {/* Rejection Reason */}
        {app.status === 'REJECTED' && app.rejection_reason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <h2 className="font-mono text-xs tracking-widest uppercase text-red-600 dark:text-red-400 mb-2">Rejection Reason</h2>
            <p className="text-sm text-red-700 dark:text-red-300">{app.rejection_reason}</p>
          </div>
        )}

        {failureReason && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
            <h2 className="font-mono text-xs tracking-widest uppercase text-amber-700 dark:text-amber-300 mb-2">Application Failure Reason</h2>
            <p className="text-sm text-amber-800 dark:text-amber-200">{failureReason}</p>
          </div>
        )}

        {/* Application Status */}
        <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
          <div className="table-head border-b p-4">
            <h2 className="font-mono text-xs tracking-widest uppercase">Application Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="page-copy">Current Status:</span>
              <span className="page-heading font-mono font-medium">{app.status.replace(/_/g, ' ')}</span>
            </div>
            {failureReason && (
              <div className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm dark:border-amber-800 dark:bg-amber-900/10">
                <span className="page-heading font-medium text-amber-800 dark:text-amber-200">Why this application failed</span>
                <span className="text-amber-700 dark:text-amber-300">{failureReason}</span>
              </div>
            )}
          </div>
        </div>

        {/* Semantic Gaps */}
        {app.semantic_gaps && app.semantic_gaps.length > 0 && (
          <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
            <div className="table-head border-b p-4">
              <h2 className="font-mono text-xs tracking-widest uppercase">Semantic Alignment Overview</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {app.semantic_gaps.map((gap, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${(gap.similarity || 0) >= 0.6 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    <span className="page-heading flex-1">{gap.skill || gap.requirement}</span>
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${(gap.similarity || 0) >= 0.6 ? 'text-emerald-400' : 'text-orange-400'}`}>
                      {(gap.similarity || 0) >= 0.6 ? 'Aligned' : 'Gap Identified'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Read-Only Transcript */}
        {transcript.length > 0 && (
          <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
            <div className="table-head flex items-center justify-between border-b p-4">
              <h2 className="font-mono text-xs tracking-widest uppercase">Inquiry Transcript</h2>
              <span className="bg-accent/10 text-accent font-mono text-[10px] uppercase px-2 py-1 rounded border border-accent/20">Read Only</span>
            </div>
            <div className="p-6 space-y-6">
              {transcript.map((qa, i) => (
                <div key={i} className="surface-subtle space-y-3 rounded-xl p-4">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-1">CSAS Engine Question</p>
                    <p className="surface-subtle page-heading rounded-lg p-3 text-sm">{qa.question}</p>
                  </div>
                  <div>
                    <p className="page-label font-mono text-[10px] tracking-widest uppercase mb-1 mt-3">Your Response</p>
                    <p className="surface-subtle page-copy rounded-lg p-3 text-sm opacity-90">{qa.answer}</p>
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
