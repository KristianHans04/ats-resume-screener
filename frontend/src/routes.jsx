import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // <-- Import the Auth Brain

// Layouts
import CandidateLayout from './components/layouts/CandidateLayout';
import RecruiterLayout from './components/layouts/RecruiterLayout';

// Auth
import LoginView from './pages/auth/LoginView';

// Candidate views (Phase 5)
import DashboardView      from './pages/candidate/DashboardView';
import DynamicInquiryView from './pages/candidate/DynamicInquiryView';

// Recruiter views (Phase 5)
import CommandCenterView  from './pages/recruiter/CommandCenterView';
import SemanticProfileView from './pages/recruiter/SemanticProfileView';

/**
 * routes.jsx — Application Route Tree (Phase 5)
 */

// ── THE BOUNCER ───────────────────────────────────────────
// Wraps protected layouts. If no user is logged in, redirects to /login.
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}
// ──────────────────────────────────────────────────────────

const stub = (eyebrow, name, description) => () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '16px', textAlign: 'center',
    animation: 'fadeInUp 400ms cubic-bezier(0,0,0.2,1) both',
  }}>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.625rem',
      letterSpacing: '0.15em', textTransform: 'uppercase',
      color: 'var(--text-gold)', backgroundColor: 'rgba(232,169,0,0.08)',
      border: '1px solid var(--color-gold-800)', borderRadius: '9999px',
      padding: '4px 12px',
    }}>{eyebrow}</span>
    <h2 style={{
      fontFamily: 'var(--font-display)', fontSize: '2rem',
      color: 'var(--text-primary)', letterSpacing: '-0.03em',
    }}>{name}</h2>
    <p style={{
      fontSize: '0.9375rem', color: 'var(--text-secondary)',
      maxWidth: '400px', lineHeight: '1.75',
    }}>{description}</p>
  </div>
);

// Remaining stubs for Phase 6
const RoleApplicationView = stub('Candidate · Apply',   'Apply for a Role',    'PDF resume upload and semantic parsing pipeline.');
const ApplicationSummary  = stub('Candidate · Result',  'Application Summary', 'S_final score reveal and breakdown.');
const RoleConfigView      = stub('Recruiter · Config',  'Role Configuration',  'JD input and τ threshold slider.');
const RankingBoardView    = stub('Recruiter · Rankings','Ranking Board',       'S_final ranked candidate list per role.');
const NotFound            = stub('404',                 'Not Found',           'This route does not exist.');

export const router = createBrowserRouter([
  {
    path:    '/',
    element: <Navigate to="/candidate/dashboard" replace />,
  },
  {
    path:    '/login',
    element: <LoginView />,
  },
  {
    path:    '/candidate',
    // Wrap the entire candidate section in the ProtectedRoute
    element: (
      <ProtectedRoute>
        <CandidateLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,       element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'apply',     element: <RoleApplicationView /> },
      { path: 'inquiry',   element: <DynamicInquiryView /> },
      { path: 'summary',   element: <ApplicationSummary /> },
    ],
  },
  {
    path:    '/recruiter',
    // Wrap the entire recruiter section in the ProtectedRoute
    element: (
      <ProtectedRoute>
        <RecruiterLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                   element: <Navigate to="command-center" replace /> },
      { path: 'command-center',        element: <CommandCenterView /> },
      { path: 'role-config',           element: <RoleConfigView /> },
      { path: 'ranking-board',         element: <RankingBoardView /> },
      { path: 'profiles',              element: <SemanticProfileView /> },
      { path: 'profiles/:candidateId', element: <SemanticProfileView /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);