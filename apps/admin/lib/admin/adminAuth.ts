export interface AdminSession {
  userId: string;
  token: string;
  email: string;
  name: string | null;
  role: 'admin';
  issuedAt: number;
}

const ADMIN_SESSION_KEY = 'moon_admin_owner_session_v2';
export const ADMIN_SESSION_EXPIRED_EVENT = 'moon_admin_session_expired';

interface LoginPayload {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
  };
}

function resolveDisplayName(user: LoginPayload['user']) {
  const first = user.first_name?.trim() ?? '';
  const last = user.last_name?.trim() ?? '';
  const joined = `${first} ${last}`.trim();
  return joined || null;
}

export function createAdminSession(payload: LoginPayload): AdminSession {
  return {
    userId: payload.user.id,
    token: payload.token,
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

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return window.atob(padded);
}

function isJwtExpired(token: string, skewMs = 30_000) {
  if (typeof window === 'undefined') return false;
  const [, payload] = token.split('.');
  if (!payload) return false;

  try {
    const parsed = JSON.parse(decodeBase64Url(payload)) as { exp?: number };
    if (!parsed.exp) return false;
    return parsed.exp * 1000 <= Date.now() + skewMs;
  } catch {
    return false;
  }
}

export function loadAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed.role !== 'admin' || !parsed.email || !parsed.token || !parsed.userId) {
      clearAdminSession();
      return null;
    }
    if (isJwtExpired(parsed.token)) {
      expireAdminSession();
      return null;
    }
    return parsed;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function getAdminToken() {
  return loadAdminSession()?.token ?? null;
}

export function getOwnerDefaults() {
  return {
    email: process.env.NEXT_PUBLIC_ADMIN_OWNER_EMAIL ?? 'owner@moonbrand.com'
  };
}
