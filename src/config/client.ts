import { validateClientEnv } from '@/lib/env';

/**
 * Client-side configuration
 * ✅ Safe for client-side use - contains only NEXT_PUBLIC_ variables
 * Can be used in both client and server components
 */
function createClientConfig() {
  // Validate client environment variables
  const env = validateClientEnv();

  return {
    // Add client-safe environment variables here
    // Example: API_URL: env.NEXT_PUBLIC_API_URL,
    // Example: APP_VERSION: env.NEXT_PUBLIC_APP_VERSION,

    // Domain configuration
    DOMAIN: env.NEXT_PUBLIC_DOMAIN,
    NODE_ENV: env.NEXT_PUBLIC_NODE_ENV,
    GA_MEASUREMENT_ID: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  } as const;
}

// Initialize client config once
export const clientConfig = createClientConfig();

// Export type for TypeScript inference
export type ClientConfig = typeof clientConfig;
