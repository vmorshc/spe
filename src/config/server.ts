import { validateServerEnv } from '@/lib/env';

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
    NODE_ENV: env.NODE_ENV,
    REDIS_URL: env.REDIS_URL,
    // Add other server-only configuration here
    // Example: JWT_SECRET: env.JWT_SECRET,
    // Example: SMTP_HOST: env.SMTP_HOST,
  } as const;
}

// Initialize server config once
export const serverConfig = createServerConfig();

// Export type for TypeScript inference
export type ServerConfig = typeof serverConfig;
