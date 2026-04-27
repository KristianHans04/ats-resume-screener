import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

/* ── Inline SVG icons ── */
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  ),
  Apply: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 2H10L13 5V14H3V2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M10 2V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M5 8H11M5 11H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  History: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H14M2 8H14M2 12H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  SignOut: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2H3C2.45 2 2 2.45 2 3V13C2 13.55 2.45 14 3 14H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Profile: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 14C3 11.5 5 9.5 8 9.5C11 9.5 13 11.5 13 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

const CANDIDATE_NAV = [
  {
    section: 'My Applications',
    items: [
      { label: 'Dashboard', to: '/candidate/dashboard', Icon: Icons.Dashboard },
      { label: 'Apply for Role', to: '/candidate/apply', Icon: Icons.Apply },
    ],
  },
  {
    section: 'Records',
    items: [
      { label: 'Application History', to: '/candidate/history', Icon: Icons.History },
    ],
  },
];

const PAGE_TITLES = {
  '/candidate/dashboard': { breadcrumb: 'Applications', title: 'My Dashboard' },
  '/candidate/apply':     { breadcrumb: 'Applications', title: 'Apply for a Role' },
  '/candidate/history':   { breadcrumb: 'Records', title: 'Application History' },
  '/candidate/inquiry':   { breadcrumb: 'Active Process', title: 'Dynamic Inquiry' },
};

export default function CandidateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Dynamic path matching for details pages (e.g. /candidate/history/app-001)
  const currentPath = location.pathname.includes('/candidate/history/') 
    ? '/candidate/history' 
    : location.pathname.includes('/candidate/apply/')
    ? '/candidate/apply'
    : location.pathname;

  const currentPage = PAGE_TITLES[currentPath] ?? { breadcrumb: 'Candidate Portal', title: 'CSAS' };

  const activeUser = { name: 'Ezekiel Wafula', initials: 'EW', role: 'Applicant' };

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-light font-body relative">
      
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-40" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="h-16 border-b border-border flex items-center justify-between px-4 shrink-0">
          <span className="font-mono text-xs tracking-widest uppercase text-accent md:hidden">CSAS Menu</span>
          <button className="md:hidden p-2 text-gray-400 hover:text-neutral-dark" onClick={closeSidebar}>
            <span className="w-5 h-5 block"><Icons.Close /></span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 py-6">
          {CANDIDATE_NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 px-3 mb-3">{section}</p>
              <ul className="space-y-1">
                {items.map(({ label, to, Icon }) => (
                  <li key={to}>
                    <NavLink 
                      to={to} 
                      onClick={closeSidebar} 
                      className={({ isActive }) => `
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative border border-transparent
                        ${isActive 
                          ? 'bg-cyan-50/50 text-neutral-dark border-accent before:absolute before:left-[-1px] before:top-[20%] before:h-[60%] before:w-[3px] before:bg-accent before:rounded-full' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-neutral-dark hover:border-gray-200'
                        }
                      `}
                    >
                      <span className="w-4 h-4 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"><Icon /></span>
                      <span className="flex-1 leading-none">{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative p-4 border-t border-border shrink-0" ref={popoverRef}>
          {popoverOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-white border border-border rounded-xl p-1.5 shadow-lg z-50 animate-fade-in-up">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-neutral-dark rounded-lg transition-colors text-left" onClick={() => { setPopoverOpen(false); navigate('/candidate/history'); }}>
                <span className="w-4 h-4"><Icons.Profile /></span> View Profile
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left mt-0.5" onClick={() => navigate('/login')}>
                <span className="w-4 h-4"><Icons.SignOut /></span> Sign Out
              </button>
            </div>
          )}

          <button 
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200 text-left focus:outline-none focus:ring-2 focus:ring-accent/20"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-neutral-dark text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-sm border border-neutral-dark">
              {activeUser.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-dark truncate">{activeUser.name}</p>
              <p className="font-mono text-[10px] tracking-wider uppercase text-gray-400 truncate">{activeUser.role}</p>
            </div>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center px-4 md:px-8 gap-4">
          <button className="md:hidden p-2 -ml-2 text-gray-500 hover:text-neutral-dark focus:outline-none" onClick={() => setSidebarOpen(true)}>
            <span className="w-5 h-5 block"><Icons.Menu /></span>
          </button>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 leading-none mb-1">{currentPage.breadcrumb}</span>
            <h1 className="font-display text-lg text-neutral-dark leading-none">{currentPage.title}</h1>
          </div>
        </header>

        <main className="flex-1 relative">
          <Outlet context={{ user: activeUser }} />
        </main>
      </div>
    </div>
  );
}