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

    // For now, return an empty object since no client variables are defined
    ...env,
  } as const;
}

// Initialize client config once
export const clientConfig = createClientConfig();

// Export type for TypeScript inference
export type ClientConfig = typeof clientConfig;
