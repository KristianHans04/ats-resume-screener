import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Icons = {
  Logo: () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 8L8 10.5V15.5L12 18L16 15.5V10.5L12 8Z" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  CommandCenter: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5 14H11M8 10V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  RoleConfig: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3H14M2 8H14M2 13H9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="12.5" cy="12.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M12.5 11V14M11 12.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  RankingBoard: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 13H5V8H2V13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M6.5 13H9.5V5H6.5V13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
      <path d="M11 13H14V3H11V13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  ),
  SignOut: () => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2H3C2.45 2 2 2.45 2 3V13C2 13.55 2.45 14 3 14H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <path d="M10 5L13 8L10 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 8H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

const RECRUITER_NAV = [
  {
    section: 'Overview',
    items: [
      { label: 'Command Centre', to: '/recruiter/command-center', Icon: Icons.CommandCenter },
    ],
  },
  {
    section: 'Recruitment',
    items: [
      { label: 'Jobs & Roles', to: '/recruiter/role-config', Icon: Icons.RoleConfig },
      { label: 'Ranking Board', to: '/recruiter/ranking-board', Icon: Icons.RankingBoard },
    ],
  },
];

const PAGE_TITLES = {
  '/recruiter/command-center': { breadcrumb: 'Overview', title: 'Command Centre' },
  '/recruiter/role-config': { breadcrumb: 'Recruitment', title: 'Jobs & Roles' },
  '/recruiter/create-job': { breadcrumb: 'Recruitment', title: 'Post New Job' },
  '/recruiter/ranking-board': { breadcrumb: 'Recruitment', title: 'Ranking Board' },
};

export default function RecruiterLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname.startsWith('/recruiter/profiles/') ? '/recruiter/ranking-board' : location.pathname;
  const currentPage = PAGE_TITLES[currentPath] ?? { breadcrumb: 'Recruiter Portal', title: 'CSAS' };

  const activeUser = { 
    name: user?.username || 'Guest', 
    initials: (user?.username || 'G').substring(0, 2).toUpperCase(), 
    role: 'Lead Recruiter' 
  };

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
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-40" onClick={closeSidebar} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-cyan-50 border border-cyan-200 text-accent shadow-sm">
              <Icons.Logo />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base text-neutral-dark leading-none tracking-tight">CSAS</span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-accent mt-1 leading-none">Recruiter</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 py-6">
          {RECRUITER_NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="font-mono text-[10px] tracking-widest uppercase text-gray-400 px-3 mb-3">{section}</p>
              <ul className="space-y-1">
                {items.map(({ label, to, Icon }) => (
                  <li key={to}>
                    <NavLink to={to} onClick={closeSidebar} className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${isActive ? 'bg-cyan-50/50 text-neutral-dark border-accent before:absolute before:left-[-1px] before:top-[20%] before:h-[60%] before:w-[3px] before:bg-accent before:rounded-full' : 'text-gray-500 hover:bg-gray-50'}`}>
                      <span className="w-4 h-4 opacity-70 group-hover:opacity-100"><Icon /></span>
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative p-4 border-t border-border shrink-0" ref={popoverRef}>
          {popoverOpen && (
            <div className="absolute bottom-[calc(100%+8px)] left-4 right-4 bg-white border border-border rounded-xl p-1.5 shadow-lg z-50">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg text-left" onClick={() => { setPopoverOpen(false); logout(); }}>
                <span className="w-4 h-4"><Icons.SignOut /></span> Sign Out
              </button>
            </div>
          )}
          <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl text-left" onClick={() => setPopoverOpen(!popoverOpen)}>
            <div className="w-9 h-9 rounded-full bg-neutral-dark text-white flex items-center justify-center font-mono text-xs font-bold shrink-0">{activeUser.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-dark truncate">{activeUser.name}</p>
              <p className="font-mono text-[10px] tracking-wider uppercase text-emerald-600 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </p>
            </div>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30 flex items-center px-4 md:px-8 gap-4">
          <button className="md:hidden p-2 -ml-2 text-gray-500" onClick={() => setSidebarOpen(true)}>
            <span className="w-5 h-5 block"><Icons.Menu /></span>
          </button>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-1">{currentPage.breadcrumb}</span>
            <h1 className="font-display text-lg text-neutral-dark leading-none">{currentPage.title}</h1>
          </div>
        </header>
        <main className="flex-1 relative bg-neutral-light">
          <Outlet context={{ user: activeUser }} />
        </main>
      </div>
    </div>
  );
}