import { validateServerEnv } from '@/lib/env';
import { sharedConfig } from './shared';

/**
 * Server-side configuration
 * ⚠️ WARNING: This config contains secrets and should NEVER be imported in client components
 * Only use this in server components, API routes, or server-side functions
 */
function createServerConfig() {
  // Validate environment variables at startup
  const env = validateServerEnv();

  return {
    // DATABASE_URL: env.DATABASE_URL,
    NODE_ENV: env.NEXT_PUBLIC_NODE_ENV,
    DOMAIN: env.NEXT_PUBLIC_DOMAIN,
    REDIS_URL: env.REDIS_URL,
    // Facebook OAuth configuration
    FACEBOOK_APP_ID: env.FACEBOOK_APP_ID,
    FACEBOOK_APP_SECRET: env.FACEBOOK_APP_SECRET,
    FACEBOOK_REDIRECT_URI: `${env.NEXT_PUBLIC_DOMAIN}${sharedConfig.FACEBOOK_REDIRECT_PATH}`,
    SESSION_SECRET: env.SESSION_SECRET,
    // MailerLite configuration
    MAILERLITE_API_KEY: env.MAILERLITE_API_KEY,
    MAILERLITE_GROUP_ID: env.MAILERLITE_GROUP_ID,
    // Add other server-only configuration here
    // Example: JWT_SECRET: env.JWT_SECRET,
    // Example: SMTP_HOST: env.SMTP_HOST,
  } as const;
}

// Initialize server config once
export const serverConfig = createServerConfig();

// Export type for TypeScript inference
export type ServerConfig = typeof serverConfig;
