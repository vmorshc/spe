import { randomUUID } from 'node:crypto';
import type { TempProfileData, UserSession } from '@/lib/types/auth';
import { BaseRedisRepository } from './base';

/**
 * User repository for managing user sessions in Redis
 */
export class UserRepository extends BaseRedisRepository {
  private readonly SESSION_TTL = 60 * 60 * 24; // 24 hours in seconds
  private readonly TEMP_DATA_TTL = 60 * 5; // 5 minutes in seconds

  constructor() {
    super('user');
  }

  /**
   * Create a new user session
   */
  async createSession(
    data: Omit<UserSession, 'sessionId' | 'createdAt' | 'expiresAt'>
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Redis client not available');
    }

    const sessionId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_TTL * 1000);

    const session: UserSession = {
      sessionId,
      ...data,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const key = this.getKey(`session:${sessionId}`);
    await this.client.setex(key, this.SESSION_TTL, JSON.stringify(session));

    console.log('User session created:', {
      sessionId,
      username: session.username,
      expiresAt: session.expiresAt,
    });

    return sessionId;
  }

  /**
   * Get user session by ID
   */
  async getSession(sessionId: string): Promise<UserSession | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`session:${sessionId}`);
      const sessionData = await this.client.get(key);

      if (!sessionData) {
        return null;
      }

      const session = JSON.parse(sessionData) as UserSession;

      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        await this.deleteSession(sessionId);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  }

  /**
   * Delete user session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`session:${sessionId}`);
      const result = await this.client.del(key);

      console.log('User session deleted:', { sessionId, deleted: result === 1 });
      return result === 1;
    } catch (error) {
      console.error('Failed to delete user session:', error);
      return false;
    }
  }

  /**
   * Store temporary profile data during OAuth flow
   */
  async storeTempProfileData(
    data: Omit<TempProfileData, 'tempId' | 'createdAt' | 'expiresAt'>
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Redis client not available');
    }

    const tempId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.TEMP_DATA_TTL * 1000);

    const tempData: TempProfileData = {
      tempId,
      ...data,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    const key = this.getKey(`temp:${tempId}`);
    await this.client.setex(key, this.TEMP_DATA_TTL, JSON.stringify(tempData));

    console.log('Temporary profile data stored:', {
      tempId,
      profileCount: tempData.profiles.length,
      expiresAt: tempData.expiresAt,
    });

    return tempId;
  }

  /**
   * Get temporary profile data
   */
  async getTempProfileData(tempId: string): Promise<TempProfileData | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`temp:${tempId}`);
      const tempData = await this.client.get(key);

      if (!tempData) {
        return null;
      }

      const data = JSON.parse(tempData) as TempProfileData;

      // Check if data is expired
      if (new Date(data.expiresAt) < new Date()) {
        await this.deleteTempProfileData(tempId);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Failed to get temporary profile data:', error);
      return null;
    }
  }

  /**
   * Delete temporary profile data
   */
  async deleteTempProfileData(tempId: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`temp:${tempId}`);
      const result = await this.client.del(key);

      console.log('Temporary profile data deleted:', { tempId, deleted: result === 1 });
      return result === 1;
    } catch (error) {
      console.error('Failed to delete temporary profile data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
