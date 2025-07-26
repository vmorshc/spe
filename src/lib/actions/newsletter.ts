'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import {
  BOT_FAKE_SUCCESS_MESSAGE,
  BOT_PREVENTION,
  RATE_LIMIT_MESSAGE,
} from '@/lib/constants/botPrevention';
import { mailerLiteClient } from '@/lib/mailerlite/client';
import { newsletterRateLimiter } from '@/lib/redis/repositories/rateLimiters';

/**
 * Schema for validating newsletter subscription form data
 * Includes honeypot and timing validation following Next.js patterns
 */
const subscribeSchema = z.object({
  email: z.string().email('Будь ласка, введіть дійсну email адресу'),
  // Honeypot field - should always be empty for legitimate users
  [BOT_PREVENTION.HONEYPOT_FIELD_NAME]: z.string().max(0, 'Invalid form submission'),
  // Timestamp for timing validation
  formTimestamp: z.string().optional(),
});

/**
 * Response type for newsletter subscription action
 */
export type NewsletterSubscriptionResult =
  | { status: 'success'; message: string }
  | { status: 'validation-error'; message: string }
  | { status: 'api-error'; message: string };

/**
 * Subscribe user to newsletter updates via MailerLite
 */
export async function subscribeToUpdates(
  formData: FormData
): Promise<NewsletterSubscriptionResult> {
  try {
    // Extract and validate all form data following Next.js validation patterns
    const rawFormData = {
      email: formData.get('email'),
      [BOT_PREVENTION.HONEYPOT_FIELD_NAME]: formData.get(BOT_PREVENTION.HONEYPOT_FIELD_NAME),
      formTimestamp: formData.get('formTimestamp'),
    };

    const validation = subscribeSchema.safeParse(rawFormData);

    if (!validation.success) {
      // Check if this is a honeypot violation (bot detected)
      const honeypotError = validation.error.issues.find(
        (issue) => issue.path[0] === BOT_PREVENTION.HONEYPOT_FIELD_NAME
      );

      if (honeypotError) {
        // Silent rejection for bots - return fake success
        return {
          status: 'success',
          message: BOT_FAKE_SUCCESS_MESSAGE,
        };
      }

      // Regular validation error for legitimate users
      const errorMessage = validation.error.issues[0]?.message || 'Невірний формат email';
      return {
        status: 'validation-error',
        message: errorMessage,
      };
    }

    const { email, formTimestamp } = validation.data;

    // Extract client IP for rate limiting (Next.js 13+ header handling)
    const headersList = await headers();
    const clientIP =
      headersList.get('x-forwarded-for')?.split(',')[0] ||
      headersList.get('x-real-ip') ||
      headersList.get('cf-connecting-ip') ||
      '127.0.0.1';

    // Rate limiting check
    const isRateLimited = await newsletterRateLimiter.isRateLimited(clientIP);
    if (isRateLimited) {
      return {
        status: 'validation-error',
        message: RATE_LIMIT_MESSAGE,
      };
    }

    // Timing-based bot detection
    if (formTimestamp) {
      const submissionTime = Date.now();
      const formLoadTime = parseInt(formTimestamp, 10);
      const timeDifference = submissionTime - formLoadTime;

      // Reject submissions faster than minimum time (likely bots)
      if (timeDifference < BOT_PREVENTION.MIN_SUBMISSION_TIME_MS) {
        return {
          status: 'success',
          message: BOT_FAKE_SUCCESS_MESSAGE,
        };
      }
    }

    // Subscribe user to MailerLite
    await mailerLiteClient.createOrUpdateSubscriber(email);

    return {
      status: 'success',
      message: 'Дякуємо за підписку! Ви отримаєте повідомлення про нові функції.',
    };
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Provide user-friendly error message without exposing internals
    return {
      status: 'api-error',
      message: 'Сталася помилка при підписці. Спробуйте ще раз пізніше.',
    };
  }
}
