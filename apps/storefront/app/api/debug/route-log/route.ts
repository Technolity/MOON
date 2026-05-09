import { NextRequest, NextResponse } from 'next/server';

const SENSITIVE_KEY_PATTERN = /(authorization|cookie|password|secret|token|key|otp|session|credential)/i;

function redact(value: unknown, depth = 0): unknown {
  if (value == null) {
    return value;
  }

  if (depth > 4) {
    return '[max-depth]';
  }

  if (Array.isArray(value)) {
    return value.map(item => redact(item, depth + 1));
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>((safe, [key, item]) => {
      safe[key] = SENSITIVE_KEY_PATTERN.test(key) && item != null ? '[redacted]' : redact(item, depth + 1);
      return safe;
    }, {});
  }

  return value;
}

function log(event: string, details: Record<string, unknown>) {
  console.log(`[${new Date().toISOString()}] [storefront] [info] ${event} ${JSON.stringify(redact(details))}`);
}

export async function POST(request: NextRequest) {
  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch (error) {
    payload = {
      parseError: error instanceof Error ? error.message : String(error)
    };
  }

  log('client-route-log', {
    method: request.method,
    url: request.url,
    ip: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
    payload
  });

  return NextResponse.json({ ok: true });
}
