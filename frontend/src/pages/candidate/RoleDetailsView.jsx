import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import Button from '../../components/ui/Button';
import CompanyLogo from '../../components/ui/CompanyLogo';
import { getCompanyBranding } from '../../data/companyBranding';

const MapPinIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14C11 11 13 8.82843 13 6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6C3 8.82843 5 11 8 14Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function RoleDetailsView() {
  const navigate = useNavigate();
  const { roleId } = useParams();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRole() {
      try {
        const data = await apiFetch(`/jobs/jobs/${roleId}/`);
        setRole(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [roleId]);

  if (loading) {
    return <div className="page-copy flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !role) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-transparent font-body">
        <h2 className="page-heading mb-4 text-2xl">Role Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/candidate/apply')}>Return to Job Feed</Button>
      </div>
    );
  }

  const brand = getCompanyBranding(role.company);
  const isOpen = Boolean(role.is_active);
  const hasApplied = Boolean(role.application_status && role.application_id);

  function handlePrimaryAction() {
    if (role.application_status === 'AWAITING_INQUIRY') {
      navigate(`/candidate/inquiry/${role.application_id}`);
      return;
    }
    if (hasApplied) {
      navigate(`/candidate/history/${role.application_id}`);
      return;
    }
    if (!isOpen) return;
    navigate(`/candidate/apply/${roleId}/upload`);
  }

  return (
    <div className="page-shell min-h-screen w-full bg-transparent p-6 font-body animate-fade-in-up md:p-12">
      <div className="mx-auto max-w-4xl">
        <div className="glass-card overflow-hidden rounded-[28px] shadow-sm">
          <div className="surface-divider surface-subtle border-b p-6 md:p-8">
            <Button variant="ghost" size="sm" className="-ml-3 mb-6" onClick={() => navigate('/candidate/apply')}>
              ← Back to Roles
            </Button>

            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <CompanyLogo company={role.company} className="h-16 w-16 shrink-0 md:h-20 md:w-20" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="page-label font-mono text-[10px] uppercase tracking-[0.22em]">{brand.name}</p>
                    <span className={`font-mono text-[10px] uppercase tracking-wider font-semibold ${
                      isOpen
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}>
                      {isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <h1 className="page-heading mt-3 font-display text-3xl tracking-tight md:text-4xl">{role.title}</h1>
                  <p className="page-copy mt-3 max-w-2xl text-sm leading-6">{brand.headline}</p>
                </div>
              </div>

              {role.salary && (
                <div className="surface-card rounded-2xl px-4 py-3 text-left md:min-w-[180px]">
                  <p className="page-label font-mono text-[10px] uppercase tracking-[0.18em]">Compensation</p>
                  <p className="page-heading mt-2 text-sm font-semibold">{role.salary}</p>
                </div>
              )}
            </div>

            <div className="page-copy mt-6 flex flex-wrap gap-3 text-xs">
              {role.location && <span className="surface-pill flex items-center gap-1.5 rounded-full px-3 py-1"><MapPinIcon /> {role.location}</span>}
              {role.employment_type && <span className="surface-pill flex items-center gap-1.5 rounded-full px-3 py-1"><ClockIcon /> {role.employment_type}</span>}
              {role.department && <span className="surface-pill rounded-full px-3 py-1">{role.department}</span>}
              <span className="surface-pill rounded-full px-3 py-1">{brand.industry}</span>
            </div>
          </div>

          <div className="page-copy space-y-8 p-6 text-sm leading-7 md:p-8">
            <section>
              <h2 className="page-heading mb-3 font-display text-lg">About the Role</h2>
              <p className="whitespace-pre-wrap">{role.description}</p>
            </section>

            {role.responsibilities && (
              <section>
                <h2 className="page-heading mb-3 font-display text-lg">Core Responsibilities</h2>
                <p className="whitespace-pre-wrap">{role.responsibilities}</p>
              </section>
            )}

            {role.requirements && (
              <section>
                <h2 className="page-heading mb-3 font-display text-lg">Required Capabilities</h2>
                <p className="whitespace-pre-wrap">{role.requirements}</p>
              </section>
            )}
          </div>

          <div className="surface-divider surface-subtle flex flex-col gap-4 border-t p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <div className="text-center sm:text-left">
              <h3 className="page-heading font-semibold">
                {isOpen ? 'Ready to apply?' : hasApplied ? 'This role is closed, but your application is still available.' : 'This role is no longer accepting applications.'}
              </h3>
              <p className="page-copy text-xs">
                {isOpen
                  ? hasApplied
                    ? 'You already have an application record for this role.'
                    : 'You will need your resume in PDF or DOCX format.'
                  : hasApplied
                    ? 'You can still review your submitted application history for this role.'
                    : 'Browse other open opportunities from the role directory.'}
              </p>
            </div>
            <Button
              variant={hasApplied || isOpen ? 'primary' : 'outline'}
              size="lg"
              isDisabled={!isOpen && !hasApplied}
              onClick={handlePrimaryAction}
            >
              {role.application_status === 'AWAITING_INQUIRY'
                ? 'Continue application'
                : hasApplied
                  ? 'View application'
                  : 'Proceed to Upload Resume'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
