import type { CounterOptions } from '../types';
import { BaseRedisRepository } from './base';

/**
 * Counters repository for tracking numeric counters
 */
export class CountersRepository extends BaseRedisRepository {
  constructor(options: CounterOptions = {}) {
    super(options.prefix || 'counter');
  }

  /**
   * Increment a counter by the specified amount
   */
  public async increment(counterName: string, amount: number = 1): Promise<number> {
    try {
      if (!this.client) return 1;

      const key = this.getKey(counterName);
      const newValue = await this.client.incrby(key, amount);
      return newValue;
    } catch (error) {
      console.error('Counter increment failed:', error);
      return 1;
    }
  }

  /**
   * Get the current value of a counter
   */
  public async get(counterName: string): Promise<number> {
    try {
      if (!this.client) return 0;

      const key = this.getKey(counterName);
      const value = await this.client.get(key);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Counter get failed:', error);
      return 0;
    }
  }

  /**
   * Set a counter to a specific value
   */
  public async set(counterName: string, value: number): Promise<number> {
    try {
      if (!this.client) return value;

      const key = this.getKey(counterName);
      await this.client.set(key, value.toString());
      return value;
    } catch (error) {
      console.error('Counter set failed:', error);
      return value;
    }
  }

  /**
   * Reset a counter to 0
   */
  public async reset(counterName: string): Promise<number> {
    return await this.set(counterName, 0);
  }

  /**
   * Check if a counter exists
   */
  public async has(counterName: string): Promise<boolean> {
    try {
      return await this.exists(counterName);
    } catch (_error) {
      return false;
    }
  }

  /**
   * Delete a counter
   */
  public async remove(counterName: string): Promise<boolean> {
    try {
      return await this.delete(counterName);
    } catch (_error) {
      return false;
    }
  }
}
