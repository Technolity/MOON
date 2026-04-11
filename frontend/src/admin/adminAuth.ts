export interface AdminSession {
  userId: string;
  token: string;
  email: string;
  name: string | null;
  role: 'admin';
  issuedAt: number;
}

const ADMIN_SESSION_KEY = 'moon_admin_owner_session_v2';

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

export function loadAdminSession(): AdminSession | null {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (parsed.role !== 'admin' || !parsed.email || !parsed.token || !parsed.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminToken() {
  return loadAdminSession()?.token ?? null;
}

export function getOwnerDefaults() {
  return {
    email: import.meta.env.VITE_ADMIN_OWNER_EMAIL ?? 'owner@moonbrand.com'
  };
}
