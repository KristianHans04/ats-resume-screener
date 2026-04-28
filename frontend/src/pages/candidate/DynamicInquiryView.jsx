import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

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
function toPercentage(value) {
  if (value === null || value === undefined) return null;
  const num = parseFloat(value);
  const pct = num <= 1 && !Number.isInteger(num) ? num * 100 : num;
  return `${Math.round(pct)}%`;
}

const MAX_CHARS = 600;

export default function DynamicInquiryView() {
  const { appId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const charCount = draft.length;

  // Fetch application data
  useEffect(() => {
    async function fetchApplication() {
      try {
        const data = await apiFetch(`/jobs/applications/${appId}/`);
        setApplication(data);
        
        // Initialize chat with the first question if available
        const questions = data.generated_questions || [];
        if (questions.length > 0) {
          setMessages([questions[0]]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (appId) {
      fetchApplication();
    } else {
      setLoading(false);
      setError("No Application ID provided");
    }
  }, [appId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit() {
    if (!draft.trim() || submitting || complete || !application) return;

    const answerText = draft.trim();
    setDraft('');
    setSubmitting(true);

    const newAnswer = {
      question_id: messages[messages.length - 1].id,
      text: answerText
    };
    
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);

    setMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', text: answerText }]);

    const questions = application.generated_questions || [];
    const nextIndex = currentQuestionIndex + 1;

    // Simulate delay for chat feel
    setTimeout(async () => {
      if (nextIndex < questions.length) {
        // Ask the next question
        setMessages(prev => [...prev, questions[nextIndex]]);
        setCurrentQuestionIndex(nextIndex);
        setSubmitting(false);
      } else {
        // All questions answered, submit to backend
        try {
          await apiFetch(`/jobs/applications/${appId}/answer/`, {
            method: 'POST',
            body: JSON.stringify({ answers: updatedAnswers })
          });
          setComplete(true);
        } catch (err) {
          console.error("Error submitting answers:", err);
        } finally {
          setSubmitting(false);
        }
      }
    }, 800);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }

  if (loading) return <div className="p-12 text-center font-body text-gray-400 bg-transparent">Loading Inquiry Room...</div>;
  if (error) return <div className="p-12 text-center font-body text-red-400 bg-transparent">Error: {error}</div>;

  const currentGap = application?.semantic_gaps?.[currentQuestionIndex];

  return (
    <div className="min-h-screen w-full bg-transparent p-4 md:p-8 font-body">
      <div className="max-w-6xl mx-auto h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 animate-fade-in-up">

        {/* ── Left: Context Panel ─────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-5 overflow-y-auto pr-2">
          
          <Button variant="ghost" size="sm" icon={ArrowLeftIcon} onClick={() => navigate('/candidate/dashboard')} className="self-start -ml-2">
            Back to Dashboard
          </Button>

          <div className="glass-card border border-white/10 p-6 rounded-2xl shadow-sm">
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent mb-2">Pending Inquiry For</p>
            <h2 className="font-display text-xl text-white mb-1">Application #{appId}</h2>
            <p className="text-sm text-gray-500 mb-6">Status: {application?.status}</p>
            
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <ProgressBar 
                value={application?.ai_score || 0} 
                label="Resume Match" 
                variant="semantic" 
                size="sm" 
                showValue 
              />
            </div>
          </div>

          {currentGap && (
            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl">
              <p className="font-mono text-[10px] tracking-widest uppercase text-orange-400 mb-4">Targeted Semantic Gap</p>
              <div className="flex items-center gap-3 py-2 border-b border-white/10 text-sm text-orange-200">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>{currentGap.skill}</span>
                <span className="font-mono ml-auto font-medium">{toPercentage(currentGap.similarity)}</span>
              </div>
              <p className="text-[10px] text-orange-400/70 leading-relaxed mt-4 uppercase tracking-wider font-mono">
                Question {currentQuestionIndex + 1} of {application?.generated_questions?.length}
              </p>
            </div>
          )}
        </aside>

        {/* ── Right: Chat Panel ───────────────────────── */}
        <div className="flex flex-col glass-card border border-white/10 rounded-2xl shadow-sm overflow-hidden h-full">
          
          <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/5 shrink-0">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">Dynamic Inquiry Room</span>
            <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-500 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {complete ? 'Analysis Complete' : 'Awaiting Response'}
            </div>
          </div>

          {complete ? (
            <div className="flex flex-col items-center justify-center text-center p-8 flex-1 animate-fade-in-up">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl text-white mb-2">Responses Submitted</h3>
              <p className="text-gray-400 max-w-sm mb-8">Your answers have been processed by the CSAS Engine. Your final score is being evaluated.</p>
              <Button variant="primary" size="md" onClick={() => navigate('/candidate/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id || Math.random()} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="font-mono text-[10px] tracking-widest uppercase text-gray-500">
                      {msg.role === 'system' ? 'CSAS Engine' : 'You'}
                    </span>
                    <div className={`max-w-[85%] sm:max-w-[75%] p-4 text-sm leading-relaxed ${
                      msg.role === 'system' 
                        ? 'bg-white/5 border border-white/10 border-l-2 border-l-accent text-white rounded-2xl rounded-tl-sm' 
                        : 'bg-accent text-white rounded-2xl rounded-tr-sm shadow-lg'
                    }`}>
                      {msg.text}
                    </div>
                    {msg.role === 'system' && msg.gap && (
                      <span className="mt-1 font-mono text-[10px] tracking-wider uppercase text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-0.5">
                        Gap: {msg.gap}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-white/5 border-t border-white/10 shrink-0">
                <textarea
                  ref={textareaRef}
                  className="w-full min-h-[80px] max-h-[200px] resize-y bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Describe your experience with specific examples… (Ctrl + Enter to send)"
                  value={draft}
                  onChange={e => setDraft(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={handleKeyDown}
                  disabled={submitting || messages.length === 0}
                  rows={3}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${charCount > MAX_CHARS * 0.85 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {charCount} / {MAX_CHARS}
                  </span>
                  <Button variant="primary" size="md" icon={SendIcon} isLoading={submitting} disabled={!draft.trim()} onClick={handleSubmit}>
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