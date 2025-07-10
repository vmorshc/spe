import Redis, { Redis as RedisType } from 'ioredis';
import { serverConfig } from '@/config/server';
import type { RedisConfig } from './types';

/**
 * Singleton Redis client with connection handling and retry logic
 */
class RedisClient {
  private client: RedisType | null = null;
  private isConnecting = false;
  private lastError: string | null = null;

  /**
   * Get the Redis client instance
   */
  public getInstance(): RedisType | null {
    if (!this.client && !this.isConnecting) {
      this.connect();
    }
    return this.client;
  }

  /**
   * Connect to Redis with retry logic
   */
  private async connect(): Promise<void> {
    if (this.isConnecting) return;

    this.isConnecting = true;
    this.lastError = null;

    try {
      const config = this.getRedisConfig();

      if (!config.url) {
        console.warn('⚠️ Redis URL not provided, Redis features will be disabled');
        this.isConnecting = false;
        return;
      }

      console.log('🔗 Connecting to Redis...');

      this.client = new Redis(config.url, {
        maxRetriesPerRequest: config.maxRetriesPerRequest || 3,
        lazyConnect: config.lazyConnect || true,
        connectTimeout: 10000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      // Event listeners
      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.lastError = null;
      });

      this.client.on('error', (error) => {
        console.error('❌ Redis connection error:', error.message);
        this.lastError = error.message;
      });

      this.client.on('disconnect', () => {
        console.log('⚠️ Redis disconnected');
      });

      this.client.on('reconnecting', () => {
        console.log('🔄 Redis reconnecting...');
      });

      // Test connection
      await this.client.ping();
      console.log('🏓 Redis ping successful');
    } catch (error) {
      console.error('❌ Failed to connect to Redis:', error);
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      this.client = null;
    } finally {
      this.isConnecting = false;
    }
  }

  /**
   * Get Redis configuration from server config
   */
  private getRedisConfig(): RedisConfig {
    return {
      url: serverConfig.REDIS_URL,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    };
  }

  /**
   * Check if Redis is available
   */
  public async isAvailable(): Promise<boolean> {
    try {
      const client = this.getInstance();
      if (!client) return false;

      await client.ping();
      return true;
    } catch (error) {
      console.error('Redis availability check failed:', error);
      return false;
    }
  }

  /**
   * Get last error message
   */
  public getLastError(): string | null {
    return this.lastError;
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.client = null;
      console.log('👋 Redis disconnected');
    }
  }

  /**
   * Force reconnect to Redis
   */
  public async reconnect(): Promise<void> {
    await this.disconnect();
    await this.connect();
  }
}

// Create singleton instance
const redisClient = new RedisClient();

// Export singleton instance
export default redisClient;

// Export Redis client type for repository usage
export { RedisType };
