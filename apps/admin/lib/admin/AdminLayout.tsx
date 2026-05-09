'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { Btn } from '@/components/ui/Btn';
import { Brand } from '@/components/ui/Brand';
import type { AdminSession } from './adminAuth';
import { ADMIN_SETTINGS_STORAGE_KEY, ADMIN_SETTINGS_UPDATED_EVENT, applyAdminAppearanceSettings } from './adminSettings';
import type { ReactNode } from 'react';

/* ─── NAV CONFIG ──────────────────────────────────────────────────── */
interface NavItem {
  id: string;
  to: string;
  label: string;
  icon: string;
  badge?: string | null;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', to: '/dashboard-overview', label: 'Dashboard', icon: 'dashboard', badge: null },
      { id: 'analytics', to: '/analytics-focus', label: 'Analytics', icon: 'monitoring', badge: 'Live' },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { id: 'products', to: '/products', label: 'Products', icon: 'inventory_2', badge: null },
      { id: 'inventory', to: '/inventory', label: 'Inventory', icon: 'shelves', badge: null },
      { id: 'collections', to: '/collections', label: 'Collections', icon: 'collections_bookmark', badge: null },
      { id: 'categories', to: '/categories', label: 'Categories', icon: 'category', badge: null },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { id: 'orders', to: '/orders', label: 'Orders', icon: 'receipt_long', badge: null },
      { id: 'customers', to: '/customers', label: 'Customers', icon: 'group', badge: null },
      { id: 'discounts', to: '/discounts', label: 'Discounts', icon: 'sell', badge: null },
    ],
  },
  {
    label: 'Storefront',
    items: [
      { id: 'pages', to: '/pages-blog', label: 'Pages & Blog', icon: 'article', badge: null },
      { id: 'media', to: '/media', label: 'Media library', icon: 'photo_library', badge: null },
      { id: 'seo', to: '/seo', label: 'SEO', icon: 'travel_explore', badge: null },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'team', to: '/team', label: 'Team', icon: 'badge', badge: null },
      { id: 'settings', to: '/settings', label: 'Settings', icon: 'tune', badge: null },
    ],
  },
];

const NAV_LABEL_TO_PAGE: Record<string, { eyebrow: string; title: string }> = {
  '/dashboard-overview': { eyebrow: 'Overview', title: 'Dashboard' },
  '/analytics-focus': { eyebrow: 'Insights', title: 'Analytics' },
  '/products': { eyebrow: 'Catalog', title: 'Products' },
  '/inventory': { eyebrow: 'Catalog', title: 'Inventory' },
  '/collections': { eyebrow: 'Catalog', title: 'Collections' },
  '/categories': { eyebrow: 'Catalog', title: 'Categories' },
  '/orders': { eyebrow: 'Commerce', title: 'Orders' },
  '/customers': { eyebrow: 'Commerce', title: 'Customers' },
  '/discounts': { eyebrow: 'Commerce', title: 'Discounts' },
  '/pages-blog': { eyebrow: 'Storefront', title: 'Pages & Blog' },
  '/media': { eyebrow: 'Storefront', title: 'Media library' },
  '/seo': { eyebrow: 'Storefront', title: 'SEO' },
  '/team': { eyebrow: 'System', title: 'Team' },
  '/settings': { eyebrow: 'System', title: 'Settings' },
};

/* ─── ICON BUTTON STYLE ───────────────────────────────────────────── */
const iconBtn: React.CSSProperties = {
  position: 'relative',
  width: 34, height: 34, borderRadius: 9,
  border: '1px solid var(--line)',
  background: 'var(--bg-elev)',
  color: 'var(--ink-2)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
};

/* ─── SIDEBAR ─────────────────────────────────────────────────────── */
function Sidebar({ session, onLogout }: { session: AdminSession; onLogout: () => void }) {
  const pathname = usePathname();
  const displayName = session.name || session.email;
  const avatarLetter = displayName.slice(0, 1).toUpperCase();

  return (
    <aside style={{
      width: 248,
      flexShrink: 0,
      background: 'var(--bg-elev)',
      borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
    }}>
      {/* Workspace switcher */}
      <div style={{ padding: '18px 16px 12px', borderBottom: '1px solid var(--line)' }}>
        <div style={{
          width: '100%',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px',
          background: 'var(--bg-sunk)',
          border: '1px solid var(--line)',
          borderRadius: 9,
          color: 'var(--ink)',
          textAlign: 'left',
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, var(--saffron), var(--terracotta))',
            color: '#FFF8EC',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 14,
            flexShrink: 0,
          }}>M</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>Moon Studio</div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>ADMIN CONSOLE</div>
          </div>
          <Icon name="unfold_more" size={14} style={{ color: 'var(--ink-3)' }} />
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 10px',
          background: 'var(--bg-sunk)',
          border: '1px solid var(--line)',
          borderRadius: 9,
          fontSize: 12.5,
          color: 'var(--ink-3)',
          cursor: 'text',
        }}>
          <Icon name="search" size={15} />
          <span style={{ flex: 1 }}>Quick jump</span>
          <span className="mono" style={{
            fontSize: 10, padding: '1px 6px',
            background: 'var(--bg-elev)',
            border: '1px solid var(--line)',
            borderRadius: 4,
          }}>⌘ K</span>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 12px 16px' }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} style={{ marginTop: 14 }}>
            <div style={{
              fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--ink-4)',
              padding: '0 10px 8px',
            }}>{group.label}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.to || pathname.startsWith(item.to + '/');
              return (
                <Link
                  key={item.id}
                  href={item.to}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: 'none',
                    background: isActive ? 'var(--saffron-soft)' : 'transparent',
                    color: isActive ? 'var(--saffron-ink)' : 'var(--ink-2)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: 1,
                    textDecoration: 'none',
                    transition: 'background .12s',
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon name={item.icon} size={17} fill={isActive ? 1 : 0} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span className="mono" style={{
                      fontSize: 10, padding: '1px 7px',
                      borderRadius: 999,
                      background: isActive ? 'var(--saffron)' : 'var(--bg-sunk)',
                      color: isActive ? '#FFF8EC' : 'var(--ink-3)',
                      border: isActive ? 'none' : '1px solid var(--line)',
                      fontWeight: 500,
                    }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User pill */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--saffron), var(--terracotta))',
          color: '#FFF8EC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 16,
        }}>{avatarLetter}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' }}>{displayName}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>Owner</div>
        </div>
        <button
          title="Log out"
          onClick={onLogout}
          style={{
            width: 26, height: 26, borderRadius: 6,
            border: '1px solid var(--line)', background: 'transparent',
            color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="logout" size={14} />
        </button>
      </div>
    </aside>
  );
}

/* ─── TOP BAR ─────────────────────────────────────────────────────── */
function TopBar({ theme, onThemeToggle }: { theme: string; onThemeToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = '/' + pathname.split('/').filter(Boolean)[0];
  const meta = NAV_LABEL_TO_PAGE[basePath] || { eyebrow: 'Admin', title: 'Console' };

  const [openPopover, setOpenPopover] = useState<'command' | 'notifications' | 'help' | null>(null);

  const togglePopover = (name: 'command' | 'notifications' | 'help') => {
    setOpenPopover((prev) => (prev === name ? null : name));
  };

  // Close popover on outside click
  useEffect(() => {
    if (!openPopover) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-topbar-popover]')) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openPopover]);

  const popoverStyle: React.CSSProperties = {
    position: 'absolute', top: '100%', right: 0, marginTop: 8,
    background: 'var(--bg-elev)', border: '1px solid var(--line)',
    borderRadius: 12, boxShadow: 'var(--shadow-lg, 0 8px 24px rgba(0,0,0,0.12))',
    minWidth: 260, padding: 0, zIndex: 100, overflow: 'hidden',
  };

  const popoverItemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
    fontSize: 13, color: 'var(--ink)', cursor: 'pointer', transition: 'background .1s',
    border: 'none', background: 'transparent', width: '100%', textAlign: 'left',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 32px',
      background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--line)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Brand />
        <span style={{ width: 1, height: 22, background: 'var(--line)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {meta.eyebrow}
          </span>
          <Icon name="chevron_right" size={14} style={{ color: 'var(--ink-4)' }} />
          <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{meta.title}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Quick Create (Bolt) */}
        <div style={{ position: 'relative' }} data-topbar-popover>
          <button title="Quick actions" onClick={() => togglePopover('command')} style={iconBtn}>
            <Icon name="bolt" size={16} />
          </button>
          {openPopover === 'command' && (
            <div style={popoverStyle}>
              <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid var(--line)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Quick Create</div>
              </div>
              <button style={popoverItemStyle} onClick={() => { setOpenPopover(null); router.push('/products/new'); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="inventory_2" size={16} style={{ color: 'var(--saffron)' }} />
                <span>New Product</span>
              </button>
              <button style={popoverItemStyle} onClick={() => { setOpenPopover(null); router.push('/orders'); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="receipt_long" size={16} style={{ color: 'var(--saffron)' }} />
                <span>View Orders</span>
              </button>
              <button style={popoverItemStyle} onClick={() => { setOpenPopover(null); router.push('/inventory'); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="shelves" size={16} style={{ color: 'var(--saffron)' }} />
                <span>Manage Inventory</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }} data-topbar-popover>
          <button title="Notifications" onClick={() => togglePopover('notifications')} style={iconBtn}>
            <Icon name="notifications" size={16} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--terracotta)',
              border: '1.5px solid var(--bg)',
            }} />
          </button>
          {openPopover === 'notifications' && (
            <div style={popoverStyle}>
              <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid var(--line)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Notifications</div>
              </div>
              <div style={{ padding: '24px 16px', textAlign: 'center' }}>
                <Icon name="notifications_none" size={28} style={{ color: 'var(--ink-4)', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>No new notifications</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 4 }}>
                  You&apos;ll see order alerts and low stock warnings here.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div style={{ position: 'relative' }} data-topbar-popover>
          <button title="Help" onClick={() => togglePopover('help')} style={iconBtn}>
            <Icon name="help" size={16} />
          </button>
          {openPopover === 'help' && (
            <div style={popoverStyle}>
              <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid var(--line)' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>Help & Support</div>
              </div>
              <a href="mailto:support@moonnaturallyyours.com" style={{ ...popoverItemStyle, textDecoration: 'none', color: 'var(--ink)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="mail" size={16} style={{ color: 'var(--saffron)' }} />
                <span>Email Support</span>
              </a>
              <button style={popoverItemStyle} onClick={() => { setOpenPopover(null); router.push('/settings'); }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon name="tune" size={16} style={{ color: 'var(--saffron)' }} />
                <span>Settings</span>
              </button>
              <div style={{ padding: '8px 16px 10px', borderTop: '1px solid var(--line)' }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>Moon Admin Console v0.1</div>
              </div>
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button
          title="Toggle theme"
          onClick={onThemeToggle}
          style={iconBtn}
        ><Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} size={16} /></button>
        <span style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
        <Btn variant="primary" icon="add" size="sm" onClick={() => router.push('/products/new')}>Create</Btn>
      </div>
    </header>
  );
}

/* ─── ADMIN LAYOUT ────────────────────────────────────────────────── */
interface AdminLayoutProps {
  session: AdminSession;
  onLogout: () => void;
  children: ReactNode;
}

export function AdminLayout({ session, onLogout, children }: AdminLayoutProps) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('moon-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('moon-theme', theme);
    applyAdminAppearanceSettings();
  }, [theme]);

  useEffect(() => {
    applyAdminAppearanceSettings();

    const handleSettingsUpdate = () => applyAdminAppearanceSettings();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === ADMIN_SETTINGS_STORAGE_KEY) {
        applyAdminAppearanceSettings();
      }
    };

    window.addEventListener(ADMIN_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(ADMIN_SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar session={session} onLogout={onLogout} />
      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar theme={theme} onThemeToggle={toggleTheme} />
        <div style={{ padding: '32px 36px 60px', maxWidth: 1320, width: '100%' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
