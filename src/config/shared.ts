/**
 * Shared configuration constants
 * These values are hardcoded and safe to use anywhere (client or server)
 */
export const sharedConfig = {
  SITE_NAME: 'Pickly',
  SITE_URL: 'https://pickly.com.ua',
  SITE_DESCRIPTION:
    'Обери переможця чесно — за хвилину, без сумнівів. Автоматично завантажуємо коментарі, обираємо випадкового переможця й показуємо результат.',
  // OAuth configuration
  FACEBOOK_REDIRECT_PATH: '/auth/callback',

  SUPPORT_EMAIL: 'support@pickly.com.ua',
  INSTAGRAM_URL: 'https://www.instagram.com/pickly.com.ua',
  FACEBOOK_PAGE_URL: 'https://www.facebook.com/pickly.com.ua',
} as const;

// Export type for TypeScript inference
export type SharedConfig = typeof sharedConfig;
