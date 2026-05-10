const path = require('path');

const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const env = {
  app: {
    name: process.env.APP_NAME || 'MOON Backend',
    port: Number(process.env.PORT || 5000),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || '/api',
    frontendUrl: (process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/+$/, ''),
    storefrontUrl: (process.env.STOREFRONT_URL || 'http://localhost:3000').replace(/\/+$/, '')
  },
  revalidate: {
    secret: process.env.REVALIDATE_SECRET || ''
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || (() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const rand = require('crypto').randomBytes(32).toString('hex');
      console.warn('[env] JWT_SECRET not set — using ephemeral random secret. Tokens will expire on server restart. Set JWT_SECRET before deploying.');
      return rand;
    })(),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceRoleKey:
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || ''
  },
  razorpay: {
    keyId: (process.env.RAZORPAY_KEY || '').trim(),
    keySecret: (process.env.RAZORPAY_SECRET || '').trim(),
    webhookSecret: (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.EMAIL_FROM || 'orders@moonbrand.com'
  },
  notifications: {
    adminEmail: process.env.ADMIN_EMAIL || ''
  },
  cron: {
    secret: process.env.CRON_SECRET || ''
  }
};

env.app.isProduction = env.app.nodeEnv === 'production';
env.app.isDevelopment = env.app.nodeEnv === 'development';

function validateEnv() {
  const criticalErrors = [];
  const warnings = [];

  if (env.app.isProduction) {
    if (!process.env.JWT_SECRET) {
      criticalErrors.push('JWT_SECRET must be set in production.');
    }
    if (env.auth.jwtSecret && env.auth.jwtSecret.length < 32) {
      criticalErrors.push('JWT_SECRET must be at least 32 characters.');
    }
    if (!env.supabase.url) {
      criticalErrors.push('SUPABASE_URL is required in production.');
    }
    if (!env.supabase.serviceRoleKey) {
      criticalErrors.push('SUPABASE_SERVICE_ROLE_KEY is required in production.');
    }
    if (!env.razorpay.keyId || !env.razorpay.keySecret) {
      warnings.push('RAZORPAY_KEY / RAZORPAY_SECRET not set — payments will fail.');
    }
    if (!env.resend.apiKey) {
      warnings.push('RESEND_API_KEY not set — order confirmation emails will not send.');
    }
  }

  if (!env.app.isProduction) {
    if (!env.supabase.url || !env.supabase.serviceRoleKey) {
      warnings.push('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — database calls will fail.');
    }
  }

  if (criticalErrors.length) {
    console.error('\n[env] FATAL — missing or insecure environment configuration:');
    criticalErrors.forEach(e => console.error(`  ✗ ${e}`));
    console.error('');
    process.exit(1);
  }

  if (warnings.length && !env.app.isProduction) {
    warnings.forEach(w => console.warn(`[env] WARNING: ${w}`));
  }
}

module.exports = env;
module.exports.validateEnv = validateEnv;
