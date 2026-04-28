import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ResumeDropzone from '../../components/candidate/ResumeDropzone';
import Button from '../../components/ui/Button';

export default function ApplicationUploadView() {
  const navigate = useNavigate();
  const { roleId } = useParams();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [error, setError] = useState(null);
  const [rejectionInfo, setRejectionInfo] = useState(null);

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
    setProgress(10);
    setLoadingMessage("Uploading resume...");

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('full_name', fullName.trim());
    formData.append('email', email.trim());
    formData.append('phone', phone.trim());

    try {
      setProgress(30);
      setLoadingMessage("Resume submitted. AI engine analyzing...");

      const applicationData = await apiFetch(`/jobs/jobs/${roleId}/apply/`, {
        method: 'POST',
        body: formData,
      });

      setProgress(100);

      if (applicationData.status === 'REJECTED') {
        setRejectionInfo({
          reason: applicationData.rejection_reason || 'Your application did not meet the requirements.',
          classification: applicationData.classification,
        });
        setLoadingMessage("Analysis Complete");
        setSuccess(true);
      } else if (applicationData.status === 'AWAITING_INQUIRY') {
        setSuccess(true);
        setLoadingMessage("Analysis Complete! Redirecting to questions...");
        setTimeout(() => navigate(`/candidate/inquiry/${applicationData.id}`), 1500);
      } else {
        setSuccess(true);
        setLoadingMessage("Application submitted successfully!");
        setTimeout(() => navigate('/candidate/dashboard'), 1500);
      }
    } catch (err) {
      console.error(err);
      setProgress(0);
      setError(err.message);
      setLoadingMessage("");
    }
  };

  return (
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
          <h1 className="page-heading font-display text-3xl md:text-4xl tracking-tight">Submit Your Application</h1>
          <p className="page-copy text-sm max-w-md mx-auto">
            Fill in your details and upload your CV. Our AI engine will analyze your resume 
            and may ask a few follow-up questions to strengthen your application.
          </p>
        </div>

        {/* Rejection Result */}
        {rejectionInfo && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
              </svg>
              <h3 className="font-display text-lg font-semibold">Application Not Accepted</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">{rejectionInfo.reason}</p>
            {rejectionInfo.classification === 'REJECTED_NOT_CV' && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Please upload an actual CV/resume document and try again.
              </p>
            )}
            <Button variant="outline" size="sm" onClick={() => {
              setRejectionInfo(null);
              setSuccess(false);
              setProgress(null);
              setSelectedFile(null);
              setLoadingMessage("");
            }}>
              Try Again
            </Button>
          </div>
        )}

        {/* Application Form */}
        {!rejectionInfo && (
          <div className="surface-card rounded-2xl p-6 md:p-10 space-y-6">
            {/* Contact Details Form */}
            <div className="space-y-4">
              <h2 className="font-mono text-[10px] tracking-widest uppercase text-accent">Your Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="page-label block text-xs font-medium mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    className="input-field w-full p-3 text-sm rounded-lg"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="page-label block text-xs font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-field w-full p-3 text-sm rounded-lg"
                    placeholder="john@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="page-label block text-xs font-medium mb-1.5">Phone</label>
                  <input
                    type="tel"
                    className="input-field w-full p-3 text-sm rounded-lg"
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="surface-divider border-t" />

            {/* Resume Upload */}
            <div className="space-y-4">
              <h2 className="font-mono text-[10px] tracking-widest uppercase text-accent">Upload CV</h2>
              <ResumeDropzone
                onFileAccepted={handleFileSelected}
                uploadProgress={progress}
                uploadSuccess={success}
                uploadMessage={loadingMessage}
                maxSizeMB={5}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 p-3 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Submit Button */}
            {selectedFile && !progress && (
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
  );
}
