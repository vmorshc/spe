/**
 * Bot prevention constants for form validation
 * These values can be adjusted based on security requirements
 */
export const BOT_PREVENTION = {
  // Honeypot field configuration
  HONEYPOT_FIELD_NAME: 'website',

  // Timing validation (in milliseconds)
  MIN_SUBMISSION_TIME_MS: 3000, // 3 seconds minimum form fill time

  // Rate limiting configuration
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute window
  RATE_LIMIT_MAX_ATTEMPTS: 3, // Maximum attempts per window
} as const;

/**
 * Success message for bot detection (fake success to prevent bot recognition)
 */
export const BOT_FAKE_SUCCESS_MESSAGE =
  'Дякуємо за підписку! Ви отримаєте повідомлення про нові функції.';

/**
 * Rate limit exceeded message
 */
export const RATE_LIMIT_MESSAGE = 'Забагато спроб. Спробуйте ще раз через хвилину.';
