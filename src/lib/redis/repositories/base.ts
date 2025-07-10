import redisClient, { type RedisType } from '../client';
import type { BaseRepository } from '../types';

/**
 * Base repository class with common Redis operations
 */
export abstract class BaseRedisRepository implements BaseRepository {
  protected client: RedisType | null;
  protected keyPrefix: string;

  constructor(keyPrefix: string = '') {
    this.client = redisClient.getInstance();
    this.keyPrefix = keyPrefix;
  }

  /**
   * Get the full key with prefix
   */
  protected getKey(key: string): string {
    return this.keyPrefix ? `${this.keyPrefix}:${key}` : key;
  }

  /**
   * Check if Redis is available
   */
  public async ping(): Promise<boolean> {
    try {
      if (!this.client) return false;
      await this.client.ping();
      return true;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    await redisClient.disconnect();
  }

  /**
   * Check if key exists
   */
  protected async exists(key: string): Promise<boolean> {
    try {
      if (!this.client) return false;
      const result = await this.client.exists(this.getKey(key));
      return result === 1;
    } catch (_error) {
      return false;
    }
  }

  /**
   * Delete key
   */
  protected async delete(key: string): Promise<boolean> {
    try {
      if (!this.client) return false;
      const result = await this.client.del(this.getKey(key));
      return result === 1;
    } catch (_error) {
      return false;
    }
  }
}
