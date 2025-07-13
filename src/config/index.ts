/**
 * Main configuration exports - CLIENT SAFE
 *
 * Usage:
 * - Use `sharedConfig` for hardcoded constants (accessible everywhere)
 * - Use `clientConfig` for client-safe environment variables
 * - For server config, import from '@/config/server' directly (contains secrets)
 */

export type { ClientEnv } from '@/lib/env';
// Re-export validation functions for manual use if needed
export { validateClientEnv } from '@/lib/env';
export { type ClientConfig, clientConfig } from './client';
// Always safe to import
export { type SharedConfig, sharedConfig } from './shared';

import type { ClientConfig } from './client';
// Import types for internal use
import type { SharedConfig } from './shared';

/**
 * Client-safe configuration type for reference
 */
export type ClientAppConfig = {
  shared: SharedConfig;
  client: ClientConfig;
};
