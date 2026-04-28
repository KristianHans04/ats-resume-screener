import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

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
  Close: () => (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L15 15M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
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
  const { theme, toggleTheme } = useTheme();
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
    <div className="flex min-h-screen bg-transparent font-body relative">
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-40" onClick={closeSidebar} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] glass-panel flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 border-b border-white/5 dark:border-white/5 border-black/5 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/20 border border-accent/30 text-accent">
              <Icons.Logo />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-base font-bold dark:text-white text-charcoal leading-none tracking-tight">CSAS</span>
              <span className="font-mono text-[9px] tracking-widest uppercase text-accent mt-1 leading-none">Recruiter</span>
            </div>
          </div>
          <button className="md:hidden p-2 dark:text-gray-400 text-soft-slate dark:hover:text-white hover:text-charcoal" onClick={closeSidebar}>
            <span className="w-5 h-5 block"><Icons.Close /></span>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8 py-6">
          {RECRUITER_NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="font-mono text-[10px] tracking-widest uppercase dark:text-gray-500 text-black/60 px-3 mb-3">{section}</p>
              <ul className="space-y-1">
                {items.map(({ label, to, Icon }) => (
                  <li key={to}>
                    <NavLink to={to} onClick={closeSidebar} className={({ isActive }) => `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${isActive ? 'bg-white/10 dark:bg-white/10 bg-black/5 dark:text-white text-charcoal shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/10 dark:border-white/10 border-black/5' : 'dark:text-gray-400 text-soft-slate hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 dark:hover:text-gray-200 hover:text-charcoal'}`}>
                      {({ isActive }) => (
                        <>
                          <span className={`w-4 h-4 transition-colors ${isActive ? 'text-accent' : 'opacity-50 group-hover:opacity-100'}`}><Icon /></span>
                          <span>{label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative p-4 border-t border-white/5 dark:border-white/5 border-black/5 shrink-0" ref={popoverRef}>
          <div className="px-2 mb-4">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 dark:bg-white/5 bg-black/5 border border-white/5 dark:border-white/5 border-black/5 hover:border-accent/30 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 flex items-center justify-center text-accent">
                  {theme === 'dark' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  )}
                </div>
                <span className="text-xs font-medium dark:text-gray-300 text-charcoal group-hover:text-accent transition-colors capitalize">{theme} Mode</span>
              </div>
              <div className="w-8 h-4 rounded-full bg-black/10 dark:bg-white/10 relative p-1">
                <div className={`w-2 h-2 rounded-full bg-accent transition-transform duration-300 ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>

          {popoverOpen && (
            <div className="absolute bottom-[calc(100%+12px)] left-4 right-4 glass-card p-1.5 shadow-2xl z-50 animate-fade-in-up">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg text-left" onClick={() => { setPopoverOpen(false); logout(); }}>
                <span className="w-4 h-4"><Icons.SignOut /></span> Sign Out
              </button>
            </div>
          )}
          <button className="w-full flex items-center gap-3 p-2 hover:bg-white/5 dark:hover:bg-white/5 hover:bg-black/5 rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 dark:hover:border-white/10 hover:border-black/5 text-left focus:outline-none" onClick={() => setPopoverOpen(!popoverOpen)}>
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent border border-accent/30 flex items-center justify-center font-mono text-xs font-bold shrink-0">{activeUser.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-white text-charcoal truncate">{activeUser.name}</p>
              <p className="font-mono text-[9px] tracking-wider uppercase text-emerald-500 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
              </p>
            </div>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-[240px]">
        <header className="h-16 bg-white/[0.02] dark:bg-white/[0.02] bg-black/[0.01] backdrop-blur-xl border-b border-white/5 dark:border-white/5 border-black/5 sticky top-0 z-30 flex items-center px-4 md:px-8 gap-4">
          <button className="md:hidden p-2 -ml-2 dark:text-gray-400 text-soft-slate dark:hover:text-white hover:text-charcoal" onClick={() => setSidebarOpen(true)}>
            <span className="w-5 h-5 block"><Icons.Menu /></span>
          </button>
          <div className="flex flex-col">
            <span className="font-mono text-[9px] tracking-widest uppercase text-accent leading-none mb-1.5">{currentPage.breadcrumb}</span>
            <h1 className="font-display text-lg font-semibold dark:text-white text-charcoal leading-none tracking-tight">{currentPage.title}</h1>
          </div>
        </header>
        <main className="flex-1 relative bg-transparent">
          <Outlet context={{ user: activeUser }} />
        </main>
      </div>
    </div>
  );
}