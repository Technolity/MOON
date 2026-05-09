'use client';

export interface AdminSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  defaultShippingCost: number;
  freeShippingThreshold: number;
  gstEnabled: boolean;
  gstRate: number;
  razorpayMode: 'live' | 'test';
  paymentTestAmount: number;
  orderEmails: boolean;
  lowStockAlerts: boolean;
  accentColor: string;
  announcementText: string;
}

export const ADMIN_SETTINGS_STORAGE_KEY = 'moon_admin_settings_v1';
export const ADMIN_SETTINGS_UPDATED_EVENT = 'moon-admin-settings-updated';

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  storeName: 'Moon Naturally Yours',
  supportEmail: 'admin@moonnaturallyyours.com',
  supportPhone: '',
  businessAddress: '',
  defaultShippingCost: 80,
  freeShippingThreshold: 3000,
  gstEnabled: false,
  gstRate: 0,
  razorpayMode: 'live',
  paymentTestAmount: 100,
  orderEmails: true,
  lowStockAlerts: true,
  accentColor: '#C9711A',
  announcementText: '',
};

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function normalizeHexColor(value: string) {
  const trimmed = value.trim();
  const short = /^#([0-9a-f]{3})$/i.exec(trimmed);
  if (short) {
    return `#${short[1].split('').map((char) => char + char).join('').toUpperCase()}`;
  }
  const full = /^#([0-9a-f]{6})$/i.exec(trimmed);
  return full ? `#${full[1].toUpperCase()}` : DEFAULT_ADMIN_SETTINGS.accentColor;
}

export function readStoredAdminSettings(): AdminSettings | null {
  if (!canUseBrowserStorage()) return null;
  try {
    const raw = window.localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    return raw ? { ...DEFAULT_ADMIN_SETTINGS, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

export function readAdminSettings(): AdminSettings {
  return readStoredAdminSettings() ?? DEFAULT_ADMIN_SETTINGS;
}

export function applyAdminAppearanceSettings(settings: Pick<AdminSettings, 'accentColor'> | null = readStoredAdminSettings()) {
  if (!canUseBrowserStorage() || !settings) return;

  const accent = normalizeHexColor(settings.accentColor);
  const root = document.documentElement;

  root.style.setProperty('--saffron', accent);
  root.style.setProperty('--saffron-soft', `color-mix(in oklab, ${accent} 24%, var(--bg))`);
  root.style.setProperty('--saffron-ink', `color-mix(in oklab, ${accent} 42%, var(--ink))`);
  root.style.setProperty('--gold', `color-mix(in oklab, ${accent} 72%, #A78428)`);
}

export function saveAdminSettings(settings: AdminSettings) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(
    ADMIN_SETTINGS_STORAGE_KEY,
    JSON.stringify({ ...settings, accentColor: normalizeHexColor(settings.accentColor) })
  );
  applyAdminAppearanceSettings(settings);
  window.dispatchEvent(new CustomEvent(ADMIN_SETTINGS_UPDATED_EVENT));
}
