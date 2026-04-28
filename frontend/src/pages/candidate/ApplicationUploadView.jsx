import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ResumeDropzone from '../../components/candidate/ResumeDropzone';
import Button from '../../components/ui/Button';

// ─── CARAPS pipeline steps (from proposal methodology) ───────────────────────
const PIPELINE_STEPS = [
  {
    id: 'extraction',
    label: 'Data Acquisition & Text Extraction',
    description: 'Converting your resume into machine-readable text. Analysing document layout to preserve logical structure — headers, work history, skills, and education are kept in sequence.',
    range: [0, 14],
  },
  {
    id: 'preprocessing',
    label: 'Pre-processing & Noise Removal',
    description: 'Normalising extracted text (§3.1.2). Removing ASCII noise artifacts, applying case normalisation, and running BERT WordPiece subword tokenisation to handle domain-specific terminology.',
    range: [14, 28],
  },
  {
    id: 'ner',
    label: 'Semantic Segmentation via NER',
    description: 'Probabilistic Named Entity Recognition (§3.1.3). Tagging each token as Skill, Role, Date, or Credential using a sequence labelling model that maximises P(tag_seq | input_seq).',
    range: [28, 45],
  },
  {
    id: 'vectorisation',
    label: 'Vectorisation & BERT Embedding',
    description: 'Generating context-aware dense vectors via Sentence-BERT (§3.2.1). Multi-head self-attention captures semantic nuances — e.g. "Lead Developer" vs "lead a team". Applying mean pooling for a fixed-size semantic document vector.',
    range: [45, 62],
  },
  {
    id: 'alignment',
    label: 'Semantic Alignment Layer',
    description: 'Computing cosine similarity between your resume vector Vr and the job description vector Vj (§3.2.3). Identifying semantic gaps where similarity falls below threshold θ — flagging areas for targeted inquiry.',
    range: [62, 77],
  },
  {
    id: 'inquiry',
    label: 'Gap Analysis & Inquiry Generation',
    description: 'Activating the RAG pipeline (§3.2). Analysing flagged gaps — missing skills, undersold projects, unsubstantiated claims — to generate 3 targeted questions that give you a chance to strengthen your application.',
    range: [77, 92],
  },
  {
    id: 'scoring',
    label: 'Candidate Visibility Score',
    description: 'Computing CVS = α·sim(Vr,Vj) + (1-α)·sem_score(A,Req) (§3.3.3). Combining your static resume alignment with dynamic inquiry performance to produce a visibility score that prioritises real knowledge over resume formatting.',
    range: [92, 100],
  },
];

// ─── Analysis modal ───────────────────────────────────────────────────────────
function AnalysisModal({ progress, done }) {
  const currentStep = PIPELINE_STEPS.find(
    (s) => progress >= s.range[0] && progress <= s.range[1],
  ) ?? PIPELINE_STEPS[PIPELINE_STEPS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
      <div
        className="surface-card w-full max-w-lg rounded-2xl p-6 shadow-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="mb-5 flex items-start gap-3">
          {!done ? (
            <div
              className="mt-0.5 h-6 w-6 flex-shrink-0 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
            />
          ) : (
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          <div>
            <h2 className="page-heading font-display text-base font-semibold">
              {done ? 'Analysis complete' : 'Context-Adaptive Recruitment & Application Profiling System AI Pipeline running.'}
            </h2>
            <p className="page-copy mt-0.5 text-[11px] font-mono uppercase tracking-widest">
              {done ? 'Redirecting you now…' : 'Do not close this window'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between text-xs page-copy">
            <span>Processing</span>
            <span className="font-mono font-semibold tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="space-y-2.5">
          {PIPELINE_STEPS.map((step) => {
            const isActive = currentStep.id === step.id && !done;
            const isDone = progress > step.range[1] || done;
            const isPending = progress < step.range[0] && !done;

            return (
              <div
                key={step.id}
                className={`flex gap-3 rounded-xl p-2.5 transition-all duration-300 ${
                  isActive ? 'bg-slate-100/60 dark:bg-slate-800/60' : ''
                } ${isPending ? 'opacity-30' : 'opacity-100'}`}
              >
                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">
                  {isDone ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div
                      className="h-5 w-5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isDone
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isActive
                        ? 'page-heading'
                        : 'page-copy'
                    }`}
                  >
                    {step.label}
                  </p>
                  {(isActive || isDone) && (
                    <p className="mt-0.5 text-xs page-copy leading-relaxed">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function ApplicationUploadView() {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [rejectionInfo, setRejectionInfo] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalProgress, setModalProgress] = useState(0);
  const [modalDone, setModalDone] = useState(false);
  const intervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => () => clearInterval(intervalRef.current), []);

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setError(null);
    setRejectionInfo(null);
    setModalProgress(0);
    setModalDone(false);
    setShowModal(true);

    // Animated fake progress: 0 → 88% while waiting for API
    let fakeProgress = 0;
    intervalRef.current = setInterval(() => {
      fakeProgress += Math.random() * 2.5 + 0.8; // avg ~1.6% per 250ms → 88% in ~14s
      if (fakeProgress >= 88) {
        fakeProgress = 88;
        clearInterval(intervalRef.current);
      }
      setModalProgress(Math.floor(fakeProgress));
    }, 250);

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('full_name', fullName.trim());
    formData.append('email', email.trim());
    formData.append('phone', phone.trim());

    try {
      const applicationData = await apiFetch(`/jobs/jobs/${roleId}/apply/`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(intervalRef.current);
      setModalProgress(100);
      setModalDone(true);

      setTimeout(() => {
        setShowModal(false);
        if (applicationData.status === 'REJECTED' || applicationData.status === 'FAILED') {
          setRejectionInfo({
            title:
              applicationData.status === 'FAILED'
                ? 'Application Could Not Be Processed'
                : 'Application Not Accepted',
            reason:
              applicationData.rejection_reason ||
              (applicationData.status === 'FAILED'
                ? 'We could not process this application successfully.'
                : 'Your application did not meet the requirements for this role.'),
            classification: applicationData.classification,
            status: applicationData.status,
          });
        } else if (applicationData.status === 'AWAITING_INQUIRY') {
          navigate(`/candidate/inquiry/${applicationData.id}`);
        } else {
          navigate('/candidate/dashboard');
        }
      }, 1600);
    } catch (err) {
      clearInterval(intervalRef.current);
      setShowModal(false);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {showModal && <AnalysisModal progress={modalProgress} done={modalDone} />}

      <div className="page-shell min-h-screen w-full bg-transparent p-6 md:p-12 font-body animate-fade-in-up flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3"
            onClick={() => navigate(`/candidate/apply/${roleId}`)}
          >
            ← Back to Job Description
          </Button>

          <div className="space-y-2 text-center">
            <h1 className="page-heading font-display text-3xl md:text-4xl tracking-tight">
              Submit Your Application
            </h1>
            <p className="page-copy mx-auto max-w-md text-sm">
              Fill in your details and upload your CV. Our AI engine will analyse your resume
              and may ask a few follow-up questions to strengthen your application.
            </p>
          </div>

          {/* Rejection result */}
          {rejectionInfo && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20 space-y-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="font-display text-lg font-semibold">{rejectionInfo.title}</h3>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300">{rejectionInfo.reason}</p>
              {rejectionInfo.classification === 'REJECTED_NOT_CV' && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Please upload an actual CV/resume document and try again.
                </p>
              )}
              {rejectionInfo.status === 'FAILED' && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  You can correct the file and submit again immediately.
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectionInfo(null);
                  setSelectedFile(null);
                }}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Application form */}
          {!rejectionInfo && (
            <div className="surface-card rounded-2xl p-6 md:p-10 space-y-6">
              {/* Contact details */}
              <div className="space-y-4">
                <h2 className="font-mono text-[10px] tracking-widest uppercase text-accent">
                  Your Details
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="page-label mb-1.5 block text-xs font-medium">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="input-field w-full rounded-lg p-3 text-sm"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="page-label mb-1.5 block text-xs font-medium">Email</label>
                    <input
                      type="email"
                      className="input-field w-full rounded-lg p-3 text-sm"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="page-label mb-1.5 block text-xs font-medium">Phone</label>
                    <input
                      type="tel"
                      className="input-field w-full rounded-lg p-3 text-sm"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="surface-divider border-t" />

              {/* Resume upload */}
              <div className="space-y-4">
                <h2 className="font-mono text-[10px] tracking-widest uppercase text-accent">
                  Upload CV
                </h2>
                <ResumeDropzone
                  onFileAccepted={handleFileSelected}
                  maxSizeMB={5}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 px-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              {selectedFile && (
                <Button
                  variant="primary"
                  size="md"
                  isFullWidth
                  onClick={handleSubmit}
                  disabled={!fullName.trim()}
                >
                  Submit Application
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
