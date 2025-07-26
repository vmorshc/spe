import { BOT_PREVENTION } from '@/lib/constants/botPrevention';
import { BaseRedisRepository } from './base';

/**
 * Abstract rate limiter interface
 */
export interface RateLimiter {
  isRateLimited(identifier: string): Promise<boolean>;
  getRemainingAttempts(identifier: string): Promise<number>;
  reset(identifier: string): Promise<boolean>;
}

/**
 * Abstract base rate limiter using Redis
 */
export abstract class BaseRateLimiter extends BaseRedisRepository implements RateLimiter {
  protected readonly windowMs: number;
  protected readonly maxAttempts: number;

  constructor(keyPrefix: string, windowMs: number, maxAttempts: number) {
    super(keyPrefix);
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  /**
   * Check if identifier has exceeded rate limits
   */
  async isRateLimited(identifier: string): Promise<boolean> {
    try {
      if (!this.client) {
        // Redis not available - fail open (allow requests)
        return false;
      }

      const key = this.getKey(identifier);
      const current = await this.client.get(key);

      if (!current) {
        // First request - set counter and expiration
        await this.client.setex(key, Math.ceil(this.windowMs / 1000), '1');
        return false;
      }

      const count = parseInt(current, 10);

      if (count >= this.maxAttempts) {
        return true; // Rate limit exceeded
      }

      // Increment counter
      await this.client.incr(key);
      return false;
    } catch (error) {
      console.error(`Rate limiter error for ${this.keyPrefix}:`, error);
      // Fail open - don't block requests if Redis is unavailable
      return false;
    }
  }

  /**
   * Get remaining attempts for identifier
   */
  async getRemainingAttempts(identifier: string): Promise<number> {
    try {
      if (!this.client) {
        // Redis not available - return max attempts
        return this.maxAttempts;
      }

      const key = this.getKey(identifier);
      const current = await this.client.get(key);

      if (!current) {
        return this.maxAttempts;
      }

      const used = parseInt(current, 10);
      return Math.max(0, this.maxAttempts - used);
    } catch (error) {
      console.error(`Rate limiter error for ${this.keyPrefix}:`, error);
      return this.maxAttempts; // Fail open
    }
  }

  /**
   * Reset rate limit for identifier
   */
  async reset(identifier: string): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }

      const key = this.getKey(identifier);
      const result = await this.client.del(key);
      return result === 1;
    } catch (error) {
      console.error(`Rate limiter reset error for ${this.keyPrefix}:`, error);
      return false;
    }
  }

  /**
   * Get time until rate limit window resets (in seconds)
   */
  async getTimeUntilReset(identifier: string): Promise<number> {
    try {
      if (!this.client) {
        return 0;
      }

      const key = this.getKey(identifier);
      const ttl = await this.client.ttl(key);
      return Math.max(0, ttl);
    } catch (error) {
      console.error(`Rate limiter TTL error for ${this.keyPrefix}:`, error);
      return 0;
    }
  }
}

/**
 * Newsletter subscription rate limiter
 */
export class NewsletterRateLimiter extends BaseRateLimiter {
  constructor() {
    super(
      'newsletter_rate_limit',
      BOT_PREVENTION.RATE_LIMIT_WINDOW_MS,
      BOT_PREVENTION.RATE_LIMIT_MAX_ATTEMPTS
    );
  }
}

// Export singleton instances
export const newsletterRateLimiter = new NewsletterRateLimiter();
