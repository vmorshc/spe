import type { InstagramMedia, InstagramProfile } from '@/lib/facebook/types';
import { BaseRedisRepository } from './base';

/**
 * Instagram repository for managing Instagram profile and posts cache
 */
export class InstagramRepository extends BaseRedisRepository {
  private readonly CACHE_TTL = 300; // 5 minutes in seconds

  constructor() {
    super('instagram');
  }

  /**
   * Get cached Instagram profile
   */
  async getProfile(userId: string): Promise<InstagramProfile | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:profile:${userId}`);
      const profileData = await this.client.get(key);

      if (!profileData) {
        return null;
      }

      return JSON.parse(profileData) as InstagramProfile;
    } catch (error) {
      console.error('Failed to get Instagram profile from cache:', error);
      return null;
    }
  }

  /**
   * Set Instagram profile cache
   */
  async setProfile(userId: string, profile: InstagramProfile): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:profile:${userId}`);
      await this.client.setex(key, this.CACHE_TTL, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Failed to set Instagram profile cache:', error);
      return false;
    }
  }

  /**
   * Get cached Instagram posts (legacy method)
   */
  async getPosts(userId: string, cursor?: string): Promise<InstagramMedia[] | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:posts:${userId}:${cursor || 'initial'}`);
      const postsData = await this.client.get(key);

      if (!postsData) {
        return null;
      }

      return JSON.parse(postsData) as InstagramMedia[];
    } catch (error) {
      console.error('Failed to get Instagram posts from cache:', error);
      return null;
    }
  }

  /**
   * Set Instagram posts cache (legacy method)
   */
  async setPosts(userId: string, posts: InstagramMedia[], cursor?: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:posts:${userId}:${cursor || 'initial'}`);
      await this.client.setex(key, this.CACHE_TTL, JSON.stringify(posts));
      return true;
    } catch (error) {
      console.error('Failed to set Instagram posts cache:', error);
      return false;
    }
  }

  /**
   * Get cached Instagram posts with cursor information
   */
  async getPostsWithCursor(
    userId: string,
    cacheKey: string
  ): Promise<{
    posts: InstagramMedia[];
    nextCursor?: string;
    hasMore: boolean;
  } | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:posts:${userId}:${cacheKey}`);
      const postsData = await this.client.get(key);

      if (!postsData) {
        return null;
      }

      return JSON.parse(postsData) as {
        posts: InstagramMedia[];
        nextCursor?: string;
        hasMore: boolean;
      };
    } catch (error) {
      console.error('Failed to get Instagram posts with cursor from cache:', error);
      return null;
    }
  }

  /**
   * Set Instagram posts cache with cursor information
   */
  async setPostsWithCursor(
    userId: string,
    cacheKey: string,
    data: {
      posts: InstagramMedia[];
      nextCursor?: string;
      hasMore: boolean;
    }
  ): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:posts:${userId}:${cacheKey}`);
      await this.client.setex(key, this.CACHE_TTL, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to set Instagram posts with cursor cache:', error);
      return false;
    }
  }

  /**
   * Invalidate all cache for a user
   */
  async invalidateUserCache(userId: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      // Get all Instagram keys for this user
      const profileKey = this.getKey(`instagram:profile:${userId}`);
      const postsPattern = this.getKey(`instagram:posts:${userId}:*`);

      // Delete profile key
      await this.client.del(profileKey);

      // Find and delete all posts keys for this user
      const postsKeys = await this.client.keys(postsPattern);
      if (postsKeys.length > 0) {
        await this.client.del(...postsKeys);
      }

      console.log(`Invalidated Instagram cache for user ${userId}`);
      return true;
    } catch (error) {
      console.error('Failed to invalidate Instagram cache:', error);
      return false;
    }
  }

  /**
   * Check if profile exists in cache
   */
  async hasProfile(userId: string): Promise<boolean> {
    const key = this.getKey(`instagram:profile:${userId}`);
    return await this.exists(key);
  }

  /**
   * Check if posts exist in cache
   */
  async hasPosts(userId: string, cursor?: string): Promise<boolean> {
    const key = this.getKey(`instagram:posts:${userId}:${cursor || 'initial'}`);
    return await this.exists(key);
  }
}

// Export singleton instance
export const instagramRepository = new InstagramRepository();
