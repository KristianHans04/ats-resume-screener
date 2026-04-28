import React, { useState, useRef, useCallback } from 'react';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

const MAX_SIZE_BYTES_DEFAULT = 5 * 1024 * 1024; // 5 MB

/* ── Format file size ────────────────────────────────────── */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/* ── Inline SVG icons ────────────────────────────────────── */
const UploadIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 transition-all duration-300">
    <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 28V18M24 18L19 23M24 18L29 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 36H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.webp'];

function getFileLabel(file) {
  const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
  return ext.slice(0, 4);
}

function getFileColor(file) {
  const type = file.type.toLowerCase();
  if (type === 'application/pdf') return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-500' };
  if (type.startsWith('image/')) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-500' };
  return { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-500' };
}

const FileIcon = ({ file }) => {
  const colors = file ? getFileColor(file) : { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-500' };
  return (
    <svg viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 mb-2 ${colors.text}`}>
      <path d="M3 2H13L17 6V22H3V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M13 2V6H17" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
};

const CloseIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5">
    <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 4V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <circle cx="7" cy="9.5" r="0.5" fill="currentColor"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Component ───────────────────────────────────────────── */
export default function ResumeDropzone({
  onFileAccepted,
  onFileRemoved,
  uploadProgress = null,
  uploadSuccess = false,
  uploadError = null,
  uploadMessage = "Uploading & parsing CV…", // <-- New prop added here
  disabled = false,
  maxSizeMB = 5,
  className = '',
}) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const inputRef = useRef(null);

  const activeError = uploadError || localError;
  const isUploading = uploadProgress !== null && !uploadSuccess;

  /* ── Handlers ── */
  const validateAndAccept = useCallback((file) => {
    setLocalError(null);
    if (!file) return;
    const isAccepted = ACCEPTED_TYPES.includes(file.type) ||
      ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isAccepted) {
      setLocalError('Unsupported file type. Please upload a PDF, DOCX, DOC, PNG, or JPG file.');
      return;
    }
    if (file.size > maxSizeBytes) {
      setLocalError(`File is too large (${formatBytes(file.size)}). Maximum size is ${maxSizeMB} MB.`);
      return;
    }
    setSelectedFile(file);
    onFileAccepted?.(file);
  }, [maxSizeBytes, maxSizeMB, onFileAccepted]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    validateAndAccept(e.dataTransfer.files?.[0]);
  }, [disabled, validateAndAccept]);

  const handleInputChange = useCallback((e) => {
    validateAndAccept(e.target.files?.[0]);
    e.target.value = '';
  }, [validateAndAccept]);

  const handleRemove = useCallback(() => {
    setSelectedFile(null);
    setLocalError(null);
    onFileRemoved?.();
  }, [onFileRemoved]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !selectedFile) inputRef.current?.click();
    }
  }, [disabled, selectedFile]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      
      {/* ── Drop Zone ── */}
      {!selectedFile && !uploadSuccess && (
        <div
          className={`relative flex flex-col items-center justify-center gap-4 py-12 px-8 border-2 rounded-2xl text-center cursor-pointer transition-all duration-200 outline-none
            ${isDragOver ? 'border-solid border-accent bg-cyan-50/50 dark:bg-accent/10 shadow-md text-accent' : 'border-dashed border-slate-300 dark:border-white/10 bg-white/60 dark:bg-white/5 hover:border-accent hover:bg-cyan-50/30 dark:hover:bg-accent/10 page-copy hover:text-accent focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-accent/10'}
            ${activeError ? 'border-red-400 bg-red-50 text-red-400 hover:border-red-500 focus-visible:border-red-500' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-label="Upload your resume. Click or drag a file here."
          aria-disabled={disabled}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleInputChange}
            disabled={disabled}
            aria-hidden="true"
            tabIndex={-1}
          />

          <div className={`transition-transform duration-300 ${isDragOver ? '-translate-y-1 scale-110' : ''}`}>
            <UploadIcon />
          </div>

          <div>
            <p className="page-heading font-display text-xl tracking-tight pointer-events-none mb-1">
              {isDragOver ? 'Release to upload' : 'Drop your CV here'}
            </p>
            <p className="page-copy text-sm pointer-events-none">
              {isDragOver 
                ? "We'll start processing your resume immediately"
                : <>Drag and drop your resume, or <span className="text-accent underline underline-offset-4">browse files</span></>
              }
            </p>
          </div>
          <p className="page-label font-mono text-xs tracking-wider pointer-events-none">PDF · DOCX · PNG · JPG · Max {maxSizeMB} MB</p>
        </div>
      )}

      {/* ── File Preview ── */}
      {selectedFile && !uploadSuccess && (
        <div className="surface-subtle flex items-center gap-4 rounded-xl p-4 transition-colors hover:border-accent/30" role="region">
          {(() => {
            const colors = getFileColor(selectedFile);
            const label = getFileLabel(selectedFile);
            return (
              <div className={`w-10 h-12 ${colors.bg} border ${colors.border} rounded flex flex-col items-center justify-center shrink-0 relative`}>
                <FileIcon file={selectedFile} />
                <span className={`absolute bottom-1 font-mono text-[8px] font-bold tracking-widest ${colors.text}`}>{label}</span>
              </div>
            );
          })()}
          
          <div className="flex-1 min-w-0">
            <p className="page-heading text-sm font-medium truncate" title={selectedFile.name}>{selectedFile.name}</p>
            <p className="page-label font-mono text-xs mt-0.5">{formatBytes(selectedFile.size)}</p>
          </div>

          {!isUploading && (
            <button
              className="page-copy flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
              onClick={handleRemove}
              aria-label="Remove selected file"
              type="button"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      {/* ── Upload Progress ── */}
      {isUploading && selectedFile && (
        <div className="flex flex-col gap-2">
          {/* Dynamic Message is injected here! */}
          <div className="page-label flex items-center justify-between font-mono text-[11px] tracking-tight">
            <span className="truncate mr-4">{uploadMessage}</span>
            <span className="text-accent">{uploadProgress}%</span>
          </div>
          <ProgressBar value={uploadProgress} variant="gold" size="sm" animated />
        </div>
      )}

      {/* ── Errors ── */}
      {activeError && (
        <div className="flex items-center gap-2 p-3 px-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600" role="alert">
          <ErrorIcon />
          {activeError}
        </div>
      )}

      {/* ── Success State ── */}
      {uploadSuccess && (
        <div className="flex items-center gap-3 p-3 px-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700 animate-fade-in-up" role="status">
          <CheckIcon />
          Resume uploaded and parsed successfully. Semantic alignment complete.
        </div>
      )}
    </div>
  );
}
