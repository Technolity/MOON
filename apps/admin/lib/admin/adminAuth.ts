export interface AdminSession {
  userId: string;
  email: string;
  name: string | null;
  role: 'admin';
  issuedAt: number;
}

const ADMIN_SESSION_KEY = 'moon_admin_owner_session_v2';
export const ADMIN_SESSION_EXPIRED_EVENT = 'moon_admin_session_expired';

interface UserPayload {
  id: string;
  email: string;
  role: string;
  first_name?: string | null;
  last_name?: string | null;
}

function resolveDisplayName(user: UserPayload) {
  const first = user.first_name?.trim() ?? '';
  const last = user.last_name?.trim() ?? '';
  const joined = `${first} ${last}`.trim();
  return joined || null;
}

export function createAdminSession(payload: { user: UserPayload }): AdminSession {
  return {
    userId: payload.user.id,
    email: String(payload.user.email).trim().toLowerCase(),
    name: resolveDisplayName(payload.user),
    role: 'admin',
    issuedAt: Date.now()
  };
}

export function saveAdminSession(session: AdminSession) {
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

function notifySessionExpired() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ADMIN_SESSION_EXPIRED_EVENT));
}

export function expireAdminSession() {
  clearAdminSession();
  notifySessionExpired();
}

export function loadAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed.role !== 'admin' || !parsed.email || !parsed.userId) {
      clearAdminSession();
      return null;
    }
    return parsed;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function getOwnerDefaults() {
  return {
    email: process.env.NEXT_PUBLIC_ADMIN_OWNER_EMAIL ?? 'owner@moonbrand.com'
  };
}
