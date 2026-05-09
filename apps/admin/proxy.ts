import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled by the in-app JWT login page.
// proxy.ts adds noindex headers and terminal-visible route diagnostics.
export function proxy(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();
  console.log(
    `[${new Date().toISOString()}] [admin] [info] request:proxy ${JSON.stringify({
      requestId,
      method: request.method,
      pathname: request.nextUrl.pathname,
      search: request.nextUrl.search,
      url: request.url,
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent')
    })}`
  );

  const res = NextResponse.next();
  res.headers.set('X-MOON-Request-Id', requestId);
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt).*)'],
};
