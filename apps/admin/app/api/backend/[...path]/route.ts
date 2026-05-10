import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/+$/, '');
const TOKEN_COOKIE = 'moon_admin_token';

const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 8,
};

const SAFE_FORWARD_HEADERS = ['content-type', 'accept', 'accept-language', 'cache-control', 'x-request-id'];

async function proxyRequest(req: NextRequest, pathSegments: string[]): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;
  const routePath = pathSegments.join('/');

  const backendUrl = `${BACKEND}/${routePath}${req.nextUrl.search}`;

  const forwardHeaders = new Headers();
  SAFE_FORWARD_HEADERS.forEach((h) => {
    const v = req.headers.get(h);
    if (v) forwardHeaders.set(h, v);
  });
  if (token) forwardHeaders.set('authorization', `Bearer ${token}`);

  const fetchOptions: RequestInit & { duplex?: string } = { method: req.method, headers: forwardHeaders };
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = req.body;
    fetchOptions.duplex = 'half';
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(backendUrl, fetchOptions);
  } catch {
    return NextResponse.json({ success: false, message: 'Backend unreachable.' }, { status: 502 });
  }

  const responseHeaders = new Headers();
  ['content-type', 'cache-control', 'x-request-id'].forEach((h) => {
    const v = backendRes.headers.get(h);
    if (v) responseHeaders.set(h, v);
  });

  if (routePath === 'auth/login' && backendRes.ok) {
    const data = await backendRes.json() as { success: boolean; message: string; data?: { token?: string; user?: unknown } };
    const jwt = data?.data?.token;
    const response = NextResponse.json(
      { success: data.success, message: data.message, data: { user: data?.data?.user } },
      { status: backendRes.status, headers: responseHeaders }
    );
    if (jwt) response.cookies.set(TOKEN_COOKIE, jwt, BASE_COOKIE_OPTIONS);
    return response;
  }

  if (routePath === 'auth/logout') {
    const body = await backendRes.arrayBuffer();
    const response = new NextResponse(body, { status: backendRes.status, headers: responseHeaders });
    response.cookies.set(TOKEN_COOKIE, '', { ...BASE_COOKIE_OPTIONS, maxAge: 0 });
    return response;
  }

  const body = await backendRes.arrayBuffer();
  return new NextResponse(body, { status: backendRes.status, headers: responseHeaders });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path);
}
