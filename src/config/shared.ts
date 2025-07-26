/**
 * Shared configuration constants
 * These values are hardcoded and safe to use anywhere (client or server)
 */
export const sharedConfig = {
  SITE_NAME: 'Pickly',
  // OAuth configuration
  FACEBOOK_REDIRECT_PATH: '/auth/callback',

  SUPPORT_EMAIL: 'support@pickly.com',
  INSTAGRAM_URL: 'https://www.instagram.com/pickly.dev',
  FACEBOOK_PAGE_URL: 'https://www.facebook.com/pickly.com.ua',
  // Add other hardcoded constants here as needed
  // Example: API_VERSION: "v1",
  // Example: MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Export type for TypeScript inference
export type SharedConfig = typeof sharedConfig;
