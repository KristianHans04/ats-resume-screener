import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// ── Auth ──
import LoginView from './pages/auth/LoginView';

// ── Candidate ──
import CandidateLayout from './components/layouts/CandidateLayout';
import DashboardView from './pages/candidate/DashboardView';
import DynamicInquiryView from './pages/candidate/DynamicInquiryView';
import JobDiscoveryView from './pages/candidate/JobDiscoveryView';
import RoleDetailsView from './pages/candidate/RoleDetailsView';
import ApplicationUploadView from './pages/candidate/ApplicationUploadView';
import ApplicationHistoryView from './pages/candidate/ApplicationHistoryView';
import ApplicationDetailView from './pages/candidate/ApplicationDetailView';

// ── Recruiter ──
import RecruiterLayout from './components/layouts/RecruiterLayout';
import CommandCenterView from './pages/recruiter/CommandCenterView';
import SemanticProfileView from './pages/recruiter/SemanticProfileView';
import RoleConfigView from './pages/recruiter/RoleConfigView';
import CreateJobView from './pages/recruiter/CreateJobView';
import RankingBoardView from './pages/recruiter/RankingBoardView';

/**
 * Guards an entire route tree.
 * - Not logged in  → /login
 * - Wrong role     → their correct dashboard (with a flash message via location state)
 */
function RequireRole({ role, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== role) {
    const fallback = user.role === 'CANDIDATE' ? '/candidate/dashboard' : '/recruiter/command-center';
    return (
      <Navigate
        to={fallback}
        replace
        state={{ flash: `You don't have access to that area. Redirected to your dashboard.` }}
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginView />} />

        {/* ── Candidate routes (CANDIDATE role only) ── */}
        <Route
          path="/candidate"
          element={
            <RequireRole role="CANDIDATE">
              <CandidateLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="inquiry/:appId" element={<DynamicInquiryView />} />
          <Route path="apply" element={<JobDiscoveryView />} />
          <Route path="apply/:roleId" element={<RoleDetailsView />} />
          <Route path="apply/:roleId/upload" element={<ApplicationUploadView />} />
          <Route path="history" element={<ApplicationHistoryView />} />
          <Route path="history/:appId" element={<ApplicationDetailView />} />
        </Route>

        {/* ── Recruiter routes (RECRUITER role only) ── */}
        <Route
          path="/recruiter"
          element={
            <RequireRole role="RECRUITER">
              <RecruiterLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="command-center" replace />} />
          <Route path="command-center" element={<CommandCenterView />} />
          <Route path="role-config" element={<RoleConfigView />} />
          <Route path="create-job" element={<CreateJobView />} />
          <Route path="ranking-board" element={<RankingBoardView />} />
          <Route path="profiles/:candidateId" element={<SemanticProfileView />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
