import type { InstagramComment, InstagramMedia, InstagramProfile } from '@/lib/facebook/types';
import { BaseRedisRepository } from './base';

/**
 * Instagram repository for managing Instagram profile, posts, and comments cache
 */
export class InstagramRepository extends BaseRedisRepository {
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly COMMENTS_CACHE_TTL = 900; // 15 minutes for comments

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

  /**
   * Get cached post details
   */
  async getPostDetails(postId: string): Promise<InstagramMedia | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:post:${postId}`);
      const postData = await this.client.get(key);

      if (!postData) {
        return null;
      }

      return JSON.parse(postData) as InstagramMedia;
    } catch (error) {
      console.error('Failed to get post details from cache:', error);
      return null;
    }
  }

  /**
   * Set post details cache
   */
  async setPostDetails(postId: string, post: InstagramMedia): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:post:${postId}`);
      await this.client.setex(key, this.CACHE_TTL, JSON.stringify(post));
      return true;
    } catch (error) {
      console.error('Failed to set post details cache:', error);
      return false;
    }
  }

  /**
   * Get cached comments for a post
   */
  async getComments(
    postId: string,
    cursor?: string
  ): Promise<{
    comments: InstagramComment[];
    nextCursor: string | null;
  } | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:comments:${postId}:${cursor || 'initial'}`);
      const commentsData = await this.client.get(key);

      if (!commentsData) {
        return null;
      }

      return JSON.parse(commentsData) as {
        comments: InstagramComment[];
        nextCursor: string | null;
      };
    } catch (error) {
      console.error('Failed to get comments from cache:', error);
      return null;
    }
  }

  /**
   * Set comments cache
   */
  async setComments(
    postId: string,
    cursor: string | null,
    data: {
      comments: InstagramComment[];
      nextCursor: string | null;
    }
  ): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:comments:${postId}:${cursor || 'initial'}`);
      await this.client.setex(key, this.COMMENTS_CACHE_TTL, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to set comments cache:', error);
      return false;
    }
  }

  /**
   * Get cached comments metadata (total count, etc.)
   */
  async getCommentsMetadata(postId: string): Promise<{ totalCount: number } | null> {
    if (!this.client) {
      return null;
    }

    try {
      const key = this.getKey(`instagram:comments:meta:${postId}`);
      const metaData = await this.client.get(key);

      if (!metaData) {
        return null;
      }

      return JSON.parse(metaData) as { totalCount: number };
    } catch (error) {
      console.error('Failed to get comments metadata from cache:', error);
      return null;
    }
  }

  /**
   * Set comments metadata cache
   */
  async setCommentsMetadata(postId: string, metadata: { totalCount: number }): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      const key = this.getKey(`instagram:comments:meta:${postId}`);
      await this.client.setex(key, this.COMMENTS_CACHE_TTL, JSON.stringify(metadata));
      return true;
    } catch (error) {
      console.error('Failed to set comments metadata cache:', error);
      return false;
    }
  }

  /**
   * Invalidate all cache for a specific post
   */
  async invalidatePostCache(postId: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      // Get all cache keys for this post
      const postKey = this.getKey(`instagram:post:${postId}`);
      const commentsPattern = this.getKey(`instagram:comments:${postId}:*`);
      const metaKey = this.getKey(`instagram:comments:meta:${postId}`);

      // Delete post details key
      await this.client.del(postKey);

      // Delete metadata key
      await this.client.del(metaKey);

      // Find and delete all comments keys for this post
      const commentsKeys = await this.client.keys(commentsPattern);
      if (commentsKeys.length > 0) {
        await this.client.del(...commentsKeys);
      }

      console.log(`Invalidated cache for post ${postId}`);
      return true;
    } catch (error) {
      console.error('Failed to invalidate post cache:', error);
      return false;
    }
  }

  /**
   * Invalidate comments cache for a specific post
   */
  async invalidateCommentsCache(postId: string): Promise<boolean> {
    if (!this.client) {
      return false;
    }

    try {
      // Get all comments cache keys for this post
      const commentsPattern = this.getKey(`instagram:comments:${postId}:*`);
      const metaKey = this.getKey(`instagram:comments:meta:${postId}`);

      // Delete metadata key
      await this.client.del(metaKey);

      // Find and delete all comments keys for this post
      const commentsKeys = await this.client.keys(commentsPattern);
      if (commentsKeys.length > 0) {
        await this.client.del(...commentsKeys);
      }

      console.log(`Invalidated comments cache for post ${postId}`);
      return true;
    } catch (error) {
      console.error('Failed to invalidate comments cache:', error);
      return false;
    }
  }

  /**
   * Check if post details exist in cache
   */
  async hasPostDetails(postId: string): Promise<boolean> {
    const key = this.getKey(`instagram:post:${postId}`);
    return await this.exists(key);
  }

  /**
   * Check if comments exist in cache
   */
  async hasComments(postId: string, cursor?: string): Promise<boolean> {
    const key = this.getKey(`instagram:comments:${postId}:${cursor || 'initial'}`);
    return await this.exists(key);
  }
}

// Export singleton instance
export const instagramRepository = new InstagramRepository();
