import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';

/* ── Icons ───────────────────────────────────────────────── */
const SendIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7L2 2L4.5 7L2 12L12 7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7.5 12L10.5 15L16.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

/* ── Helpers ─────────────────────────────────────────────── */
// Converts decimals to percentages safely (e.g. 0.58 -> 58%, 64 -> 64%)
function toPercentage(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

/* ── Mock Data ───────────────────────────────────────────── */
const MOCK_CONTEXT = {
  roleTitle: 'Software Engineer Intern',
  company: 'Safaricom PLC',
  resumeScore: 64,
};

const SINGLE_GAP = { skill: 'Object-Oriented Programming', similarity: 0.58 };

const PENDING_QUESTION = {
  id: 'q1',
  role: 'system',
  gap: SINGLE_GAP.skill,
  text: 'Your resume shows coursework in Java and Python, but lacks specific details on application architecture. Can you describe a recent class project or assignment where you applied Object-Oriented principles (like inheritance or encapsulation) to structure your code?',
};

const MAX_CHARS = 600;

export default function DynamicInquiryView() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([PENDING_QUESTION]);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const charCount = draft.length;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSubmit() {
    if (!draft.trim() || submitting || complete) return;

    const answer = draft.trim();
    setDraft('');
    setSubmitting(true);

    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', text: answer }]);

    setTimeout(() => {
      setSubmitting(false);
      setComplete(true);
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="min-h-screen w-full bg-neutral-light p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 animate-fade-in-up">

        {/* ── Left: Context Panel ─────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-5 overflow-y-auto pr-2">
          
          <Button variant="ghost" size="sm" icon={ArrowLeftIcon} onClick={() => navigate('/candidate/dashboard')} className="self-start">
            Back to Dashboard
          </Button>

          <div className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">Pending Inquiry For</p>
            <h2 className="font-display text-xl text-neutral-dark mb-1">{MOCK_CONTEXT.roleTitle}</h2>
            <p className="text-sm text-gray-500 mb-6">{MOCK_CONTEXT.company}</p>
            
            <div className="p-4 bg-gray-50 border border-border rounded-xl">
              {/* Removed the threshold props to simplify the UI */}
              <ProgressBar 
                value={MOCK_CONTEXT.resumeScore} 
                label="Resume Match" 
                variant="semantic" 
                size="sm" 
                showValue 
              />
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
            <p className="font-mono text-xs tracking-widest uppercase text-orange-600 mb-4">Targeted Semantic Gap</p>
            <div className="flex items-center gap-3 py-2 border-b border-orange-200/50 text-sm text-orange-800">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span>{SINGLE_GAP.skill}</span>
              {/* Replaced .toFixed(2) decimal with standardized percentage string */}
              <span className="font-mono ml-auto font-medium">{toPercentage(SINGLE_GAP.similarity)}</span>
            </div>
            <p className="text-xs text-orange-700/80 leading-relaxed mt-4">
              Please answer the pending question to close this gap and generate your final score.
            </p>
          </div>
        </aside>

        {/* ── Right: Chat Panel ───────────────────────── */}
        <div className="flex flex-col bg-white border border-border rounded-2xl shadow-sm overflow-hidden h-full">
          
          <div className="p-4 px-6 border-b border-border flex items-center justify-between bg-gray-50 shrink-0">
            <span className="font-mono text-xs tracking-widest uppercase text-gray-500">Dynamic Inquiry Room</span>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Awaiting Response
            </div>
          </div>

          {complete ? (
            <div className="flex flex-col items-center justify-center text-center p-8 flex-1 animate-fade-in-up">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-neutral-dark mb-2">Response Submitted</h3>
              <p className="text-gray-500 max-w-sm mb-8">Your answer has been processed. The CSAS engine is now calculating your final Candidate Visibility Score.</p>
              <Button variant="primary" size="md" onClick={() => navigate('/candidate/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
                      {msg.role === 'system' ? 'CSAS Engine' : 'You'}
                    </span>
                    <div className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed ${
                      msg.role === 'system' 
                        ? 'bg-gray-50 border border-border border-l-2 border-l-accent text-neutral-dark rounded-2xl rounded-tl-sm' 
                        : 'bg-accent text-white rounded-2xl rounded-tr-sm shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === 'system' && msg.gap && (
                      <span className="mt-1 font-mono text-[10px] tracking-wider uppercase text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-0.5">
                        Gap: {msg.gap}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-gray-50 border-t border-border shrink-0">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[80px] max-h-[200px] resize-y bg-white border border-border rounded-xl p-4 text-sm text-neutral-dark focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-gray-400 disabled:opacity-50"
                  placeholder="Describe your experience with specific examples… (Ctrl + Enter to send)"
                  value={draft}
                  onChange={e => setDraft(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  disabled={submitting}
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className={`font-mono text-xs ${charCount > MAX_CHARS * 0.85 ? 'text-orange-500' : 'text-gray-400'}`}>
                    {charCount} / {MAX_CHARS}
                  </span>
                  <Button variant="primary" size="md" icon={SendIcon} loading={submitting} disabled={!draft.trim()} onClick={handleSubmit}>
                    Submit Response
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}