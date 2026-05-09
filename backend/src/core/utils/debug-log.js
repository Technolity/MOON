const REDACTED = '[redacted]';

const SENSITIVE_KEY_PATTERN = /(authorization|cookie|password|secret|token|key|otp|session|credential)/i;

function durationMs(startedAt) {
  return Number(process.hrtime.bigint() - startedAt) / 1e6;
}

function redact(value, depth = 0) {
  if (value == null) {
    return value;
  }

  if (depth > 4) {
    return '[max-depth]';
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }

  if (Array.isArray(value)) {
    return value.map(item => redact(item, depth + 1));
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((safe, [key, item]) => {
      safe[key] = SENSITIVE_KEY_PATTERN.test(key) && item != null ? REDACTED : redact(item, depth + 1);
      return safe;
    }, {});
  }

  return value;
}

function serialize(details) {
  if (!details || Object.keys(details).length === 0) {
    return '';
  }

  try {
    return ` ${JSON.stringify(redact(details))}`;
  } catch (error) {
    return ` ${JSON.stringify({ serializationError: error.message })}`;
  }
}

function write(level, scope, event, details = {}) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] [${scope}] [${level}] ${event}${serialize(details)}`;

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

function requestDetails(req) {
  return {
    requestId: req.id,
    method: req.method,
    originalUrl: req.originalUrl,
    path: req.path,
    routePath: req.route?.path,
    baseUrl: req.baseUrl,
    ip: req.ip,
    ips: req.ips,
    query: req.query,
    params: req.params,
    body: req.body,
    user: req.user ? { id: req.user.id, role: req.user.role, email: req.user.email } : undefined,
    headers: {
      accept: req.headers.accept,
      authorization: req.headers.authorization,
      cookie: req.headers.cookie,
      origin: req.headers.origin,
      referer: req.headers.referer,
      'user-agent': req.headers['user-agent'],
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-request-id': req.headers['x-request-id']
    }
  };
}

module.exports = {
  durationMs,
  requestDetails,
  redact,
  write
};
