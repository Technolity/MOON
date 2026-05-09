import type { ProductKey } from '@/lib/types';

const LEGACY_FRAME_FALLBACKS: Record<string, string> = {
  moon2222: '/moon2222/ezgif-frame-162.png',
  moon333: '/moon333/ezgif-frame-162.png',
  'ezgif-2fae6b36993927b6-jpg': '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
};

const STOCK_IMAGE_BY_KEY: Record<ProductKey, string> = {
  shilajit: '/moon333/ezgif-frame-162.png',
  kashmiriSaffron: '/moon2222/ezgif-frame-162.png',
  kashmiriHoney: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  iraniSaffron: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
  kashmiriAlmonds: '/moon2222/ezgif-frame-162.png',
  walnuts: '/moon333/ezgif-frame-162.png',
  kashmiriGhee: '/ezgif-2fae6b36993927b6-jpg/ezgif-frame-146.png',
};

const UNSPLASH_FALLBACK_BY_THEME: Record<string, string> = {
  saffron: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1400&q=80',
  honey: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=80',
  shilajit: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1400&q=80',
  default: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1400&q=80',
};

const UNSPLASH_GALLERY_BY_THEME: Record<string, string[]> = {
  saffron: [
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=80',
  ],
  honey: [
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1400&q=80',
  ],
  shilajit: [
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=80',
  ],
};

export function normalizeProductImageUrl(imageUrl: string | null | undefined) {
  const value = imageUrl?.trim();
  if (!value) return undefined;
  if (value.startsWith('data:')) return undefined;
  if (/^https?:\/\//i.test(value)) return value;

  const localPath = value.startsWith('/') ? value : `/${value}`;
  const legacyMatch = localPath.match(/^\/([^/]+)\/ezgif-frame-\d{3}\.(?:jpe?g|png)$/i);
  if (legacyMatch?.[1] && LEGACY_FRAME_FALLBACKS[legacyMatch[1]]) {
    return LEGACY_FRAME_FALLBACKS[legacyMatch[1]];
  }

  return localPath;
}

export function stockImageForProduct(key?: ProductKey | null, theme?: string | null) {
  if (key && STOCK_IMAGE_BY_KEY[key]) return STOCK_IMAGE_BY_KEY[key];
  const themeKey = theme?.trim().toLowerCase();
  return UNSPLASH_FALLBACK_BY_THEME[themeKey ?? ''] ?? UNSPLASH_FALLBACK_BY_THEME.default;
}

export function productGalleryImages(options: {
  primary?: string | null;
  images?: Array<string | null | undefined> | null;
  key?: ProductKey | null;
  theme?: string | null;
}) {
  const themeKey = options.theme?.trim().toLowerCase() || 'default';
  const stockImage = stockImageForProduct(options.key, options.theme);
  const unsplashGallery =
    UNSPLASH_GALLERY_BY_THEME[themeKey] ??
    (options.key === 'shilajit' ? UNSPLASH_GALLERY_BY_THEME.shilajit : undefined) ??
    UNSPLASH_GALLERY_BY_THEME.saffron;

  const candidates = [
    ...(options.images ?? []),
    options.primary,
    stockImage,
    ...unsplashGallery,
    UNSPLASH_FALLBACK_BY_THEME.default,
  ];

  const seen = new Set<string>();
  return candidates.reduce<string[]>((result, candidate) => {
    const normalized = normalizeProductImageUrl(candidate);
    if (!normalized || seen.has(normalized)) return result;
    seen.add(normalized);
    result.push(normalized);
    return result;
  }, []);
}
