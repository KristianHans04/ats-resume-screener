import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ── Auth Imports ──
import LoginView from './pages/auth/LoginView';

// ── Candidate Imports ──
import CandidateLayout from './components/layouts/CandidateLayout'; 
import DashboardView from './pages/candidate/DashboardView';
import DynamicInquiryView from './pages/candidate/DynamicInquiryView';
import JobDiscoveryView from './pages/candidate/JobDiscoveryView';
import RoleDetailsView from './pages/candidate/RoleDetailsView';
import ApplicationUploadView from './pages/candidate/ApplicationUploadView';
import ApplicationHistoryView from './pages/candidate/ApplicationHistoryView';
import ApplicationDetailView from './pages/candidate/ApplicationDetailView';

// ── Recruiter Imports ──
import RecruiterLayout from './components/layouts/RecruiterLayout'; 
import CommandCenterView from './pages/recruiter/CommandCenterView';
import SemanticProfileView from './pages/recruiter/SemanticProfileView';
import RoleConfigView from './pages/recruiter/RoleConfigView';
import CreateJobView from './pages/recruiter/CreateJobView';
import RankingBoardView from './pages/recruiter/RankingBoardView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* ── Nested Candidate Routes ── */}
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="inquiry/:appId" element={<DynamicInquiryView />} />
          <Route path="apply" element={<JobDiscoveryView />} />
          <Route path="apply/:roleId" element={<RoleDetailsView />} />
          <Route path="apply/:roleId/upload" element={<ApplicationUploadView />} />
          <Route path="history" element={<ApplicationHistoryView />} />
          <Route path="history/:appId" element={<ApplicationDetailView />} />
        </Route>
        
        {/* ── Nested Recruiter Routes ── */}
        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route index element={<Navigate to="command-center" replace />} />
          <Route path="command-center" element={<CommandCenterView />} />
          
          <Route path="role-config" element={<RoleConfigView />} />
          <Route path="create-job" element={<CreateJobView />} />
          
          <Route path="ranking-board" element={<RankingBoardView />} />
          
          {/* Even though 'Candidate Profiles' is removed from the sidebar menu, 
              we need this route so the Ranking Board can link to the Deep Dive view! */}
          <Route path="profiles/:candidateId" element={<SemanticProfileView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}