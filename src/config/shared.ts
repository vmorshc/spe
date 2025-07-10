/**
 * Shared configuration constants
 * These values are hardcoded and safe to use anywhere (client or server)
 */
export const sharedConfig = {
  SITE_NAME: 'Sure Pick Engine',
  // Add other hardcoded constants here as needed
  // Example: API_VERSION: "v1",
  // Example: MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Export type for TypeScript inference
export type SharedConfig = typeof sharedConfig;
