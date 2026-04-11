import { FormEvent, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { AdminSession } from './adminAuth';

interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
}

const links = [
  { to: '/admin/dashboard-overview', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/inventory', label: 'Inventory', icon: 'inventory_2' },
  { to: '/admin/analytics-focus', label: 'Analytics', icon: 'analytics' }
];

function routeTitle(pathname: string) {
  if (pathname.includes('/inventory')) return 'Inventory & Insights';
  if (pathname.includes('/analytics-focus')) return 'Analytics Focus';
  return 'Dashboard Overview';
}

export function AdminLayout({ session, onLogout }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const displayName = session.name || session.email;
  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return;

    if (normalized.includes('invent')) {
      navigate('/admin/inventory');
      return;
    }
    if (normalized.includes('analytic') || normalized.includes('revenue')) {
      navigate('/admin/analytics-focus');
      return;
    }
    navigate('/admin/dashboard-overview');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-slate-50 text-slate-900 lg:flex">
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-200 flex flex-col py-6 px-4 transform transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-[260px] lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 px-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#454e90]">Precision Editorial</h1>
            <p className="font-['Inter'] text-xs font-medium text-slate-500 tracking-tight mt-1 uppercase">Admin Console</p>
          </div>
          <button
            type="button"
            className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 text-slate-600"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 text-[#454e90] font-semibold border-r-2 border-[#454e90] bg-slate-100 transition-colors rounded-l-lg'
                  : 'flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors rounded-l-lg'
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-['Inter'] text-sm font-medium tracking-tight">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto px-2 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">Store Owner</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main id="main-content" className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl border border-slate-200 text-slate-700"
                aria-label="Open sidebar"
              >
                <span className="material-symbols-outlined text-base">menu</span>
              </button>
              <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base sm:text-lg text-slate-900 truncate">{routeTitle(location.pathname)}</h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
                type="button"
                onClick={() => navigate('/admin/analytics-focus')}
                aria-label="Open analytics alerts"
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
                type="button"
                onClick={() => window.alert('Tip: Search terms like inventory, analytics, or revenue to jump between layouts.')}
                aria-label="Dashboard help"
              >
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <div className="hidden sm:block h-8 w-px bg-slate-200" />
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                {avatarLetter}
              </div>
            </div>

            <form className="relative w-full sm:w-auto sm:min-w-[280px] lg:min-w-[340px]" onSubmit={onSearchSubmit}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input
                className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[#454e90]/20 focus:border-[#454e90]/40 outline-none"
                placeholder="Search dashboard..."
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </form>
          </div>
        </header>

        <div className="pb-24 lg:pb-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-lg lg:hidden">
        <div className="grid grid-cols-3 px-2 py-2">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <NavLink
                key={`mobile-${link.to}`}
                to={link.to}
                className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 transition-colors ${
                  isActive ? 'text-[#454e90] bg-[#454e90]/10' : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] leading-none">{link.icon}</span>
                <span className="text-[11px] font-semibold tracking-tight">{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
