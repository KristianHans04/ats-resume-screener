import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import ResumeDropzone from '../../components/candidate/ResumeDropzone';
import Button from '../../components/ui/Button';

export default function ApplicationUploadView() {
  const navigate = useNavigate();
  const { roleId } = useParams();
  
  const [progress, setProgress] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleUpload = async (file) => {
    setProgress(10);
    setLoadingMessage("Uploading resume...");

    const formData = new FormData();
    formData.append('resume', file);
    // Add dummy values if your serializer requires them, though usually resume is enough.

    try {
      // 1. Submit Application
      const applicationData = await apiFetch(`/jobs/jobs/${roleId}/apply/`, {
        method: 'POST',
        body: formData, // let apiFetch handle headers
      });

      const appId = applicationData.id;
      setProgress(40);
      setLoadingMessage("Resume submitted. AI engine parsing and scoring...");

      // 2. Poll for Celery Task Completion
      const pollInterval = setInterval(async () => {
        try {
          const app = await apiFetch(`/jobs/applications/${appId}/`);
          
          if (app.status === 'PARSING') {
            setProgress(prev => Math.min(prev + 10, 90));
          } else {
            // Processing done
            clearInterval(pollInterval);
            setProgress(100);
            setSuccess(true);
            setLoadingMessage("Analysis Complete!");

            setTimeout(() => {
              if (app.status === 'AWAITING_INQUIRY') {
                navigate(`/candidate/inquiry/${appId}`);
              } else {
                navigate('/candidate/dashboard');
              }
            }, 1500);
          }
        } catch (err) {
          console.error("Polling error", err);
          clearInterval(pollInterval);
        }
      }, 2000);

    } catch (err) {
      console.error(err);
      setProgress(0);
      setLoadingMessage(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-light p-6 md:p-12 font-body animate-fade-in-up flex items-center justify-center">
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
          <h1 className="font-display text-3xl md:text-4xl text-neutral-dark tracking-tight">Submit Your Application</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Our AI engine will instantly analyze your resume against the role requirements. 
            Based on the results, you may be asked a few follow-up questions to clarify your experience.
          </p>
        </div>

        <div className="bg-white p-6 md:p-10 border border-border rounded-2xl shadow-sm">
          <ResumeDropzone
            onFileAccepted={handleUpload}
            uploadProgress={progress}
            uploadSuccess={success}
            uploadMessage={loadingMessage}
            maxSizeMB={5}
          />
        </div>

      </div>
    </div>
  );
}