import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

const COOKIE = '__admin_gate';

const NOINDEX_HEADERS = {
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

function gateToken(user: string, pass: string) {
  return Buffer.from(`${user}:${pass}`).toString('base64');
}

export async function GET(req: NextRequest) {
  const user = process.env.ADMIN_BASIC_AUTH_USER ?? '';
  const pass = process.env.ADMIN_BASIC_AUTH_PASS ?? '';
  const rawReturn = req.nextUrl.searchParams.get('return') ?? '/dashboard-overview';
  const safePath =
    rawReturn.startsWith('/') && !rawReturn.startsWith('//')
      ? rawReturn
      : '/dashboard-overview';
  const returnUrl = new URL(req.url);
  returnUrl.pathname = safePath;
  returnUrl.search = '';

  if (!user || !pass || pass === 'change-me-in-production') {
    return Response.redirect(returnUrl, 302);
  }

  const auth = req.headers.get('authorization') ?? '';
  const [scheme, encoded = ''] = auth.split(' ');

  if (scheme === 'Basic') {
    const decoded = Buffer.from(encoded, 'base64').toString();
    const colonIdx = decoded.indexOf(':');
    const u = decoded.slice(0, colonIdx);
    const p = decoded.slice(colonIdx + 1);

    if (u === user && p === pass) {
      const store = await cookies();
      store.set(COOKIE, gateToken(user, pass), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
        path: '/',
      });
      return Response.redirect(returnUrl, 302);
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      ...NOINDEX_HEADERS,
      'WWW-Authenticate': 'Basic realm="Admin Console", charset="UTF-8"',
    },
  });
}
