import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResumeDropzone from '../../components/candidate/ResumeDropzone';
import Button from '../../components/ui/Button';

const PROCESSING_STEPS = [
  "Initializing pdfplumber for Text Extraction...",
  "Executing Subword Tokenization...",
  "Running Probabilistic Named Entity Recognition...",
  "Mapping entities to hierarchical JSON...",
  "Applying Multi-Head Attention and Mean Pooling...",
  "Generating Sentence Vector Embeddings...",
  "Calculating High-Dimensional Cosine Similarity...",
  "Evaluating Semantic Alignment Threshold..."
];

export default function ApplicationUploadView() {
  const navigate = useNavigate();
  const { roleId } = useParams();
  
  const [progress, setProgress] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleUpload = (file) => {
    setProgress(0);
    setLoadingMessage(PROCESSING_STEPS[0]);
    
    let currentStep = 0;
    const totalSteps = PROCESSING_STEPS.length;
    const stepDurationMs = 750; // 8 steps * 750ms = exactly 6000ms (6 seconds)

    const interval = setInterval(() => {
      currentStep++;
      
      if (currentStep >= totalSteps) {
        // Finalize loading
        clearInterval(interval);
        setProgress(100);
        setSuccess(true);
        
        // Wait 2 seconds for user to read success message, then route them
        setTimeout(() => { executeLogicGate(); }, 2000);
      } else {
        // Update progress and message
        setProgress(Math.round((currentStep / totalSteps) * 100));
        setLoadingMessage(PROCESSING_STEPS[currentStep]);
      }
    }, stepDurationMs);
  };

  const executeLogicGate = () => {
    const simulatedResumeScore = 64; 
    if (simulatedResumeScore >= 90) {
      alert("Perfect match! You have been auto-shortlisted.");
      navigate('/candidate/dashboard');
    } 
    else if (simulatedResumeScore < 50) {
      alert("Unfortunately, your CV does not meet the minimum requirements.");
      navigate('/candidate/dashboard');
    } 
    else {
      navigate('/candidate/inquiry');
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
            uploadMessage={loadingMessage} /* <--- Passes dynamic message down */
            maxSizeMB={5}
          />
        </div>

      </div>
    </div>
  );
}