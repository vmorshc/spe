/**
 * Main configuration exports
 *
 * Usage:
 * - Use `sharedConfig` for hardcoded constants (accessible everywhere)
 * - Use `clientConfig` for client-safe environment variables
 * - Use `serverConfig` only in server components/API routes (contains secrets)
 */

export type { ClientEnv, ServerEnv } from '@/lib/env';
// Re-export validation functions for manual use if needed
export { validateClientEnv, validateServerEnv } from '@/lib/env';
export { type ClientConfig, clientConfig } from './client';
// Server-only exports (with runtime warning for client-side usage)
export { type ServerConfig, serverConfig } from './server';
// Always safe to import
export { type SharedConfig, sharedConfig } from './shared';

import type { ClientConfig } from './client';
import type { ServerConfig } from './server';
// Import types for internal use
import type { SharedConfig } from './shared';

/**
 * Combined configuration type for reference
 */
export type AppConfig = {
  shared: SharedConfig;
  client: ClientConfig;
  server: ServerConfig;
};
