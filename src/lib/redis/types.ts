/**
 * Redis-related TypeScript interfaces and types
 */

export interface RedisConfig {
  url?: string;
  retryDelayOnFailover?: number;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

export interface CounterOptions {
  prefix?: string;
}

export interface BaseRepository {
  ping(): Promise<boolean>;
  disconnect(): Promise<void>;
}
