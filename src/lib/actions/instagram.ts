'use server';

import { facebookClient } from '@/lib/facebook/client';
import type {
  FacebookInstagramAccountDetails,
  InstagramMedia,
  InstagramProfile,
} from '@/lib/facebook/types';
import { instagramRepository } from '@/lib/redis/repositories/instagram';
import { getCurrentUser, initiateOAuthLogin } from './auth';

/**
 * Get Instagram profile with caching
 */
export async function getInstagramProfile(): Promise<InstagramProfile | null> {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    // Check cache first
    const cachedProfile = await instagramRepository.getProfile(user.instagramId);
    if (cachedProfile) {
      console.log('Instagram profile cache hit');
      return cachedProfile;
    }

    // Fetch from API with extended fields
    const profileData = (await facebookClient.getInstagramAccountDetails(
      user.instagramId,
      user.accessToken
    )) as FacebookInstagramAccountDetails;

    const profile: InstagramProfile = {
      id: profileData.id,
      username: profileData.username,
      name: profileData.name,
      followers_count: profileData.followers_count,
      media_count: profileData.media_count,
      biography: profileData.biography,
      profile_picture_url: profileData.profile_picture_url,
    };

    // Cache the result
    await instagramRepository.setProfile(user.instagramId, profile);
    console.log('Instagram profile fetched and cached');

    return profile;
  } catch (error) {
    console.error('Failed to get Instagram profile:', error);
    throw new Error('Failed to fetch Instagram profile');
  }
}

/**
 * Get Instagram posts with pagination and caching
 */
export async function getInstagramPosts(after?: string): Promise<{
  posts: InstagramMedia[];
  nextCursor?: string;
  hasMore: boolean;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { posts: [], hasMore: false };
    }

    const cacheKey = after || 'initial';

    // Check cache first
    const cachedResult = await instagramRepository.getPostsWithCursor(user.instagramId, cacheKey);
    if (cachedResult) {
      console.log('Instagram posts cache hit');
      return cachedResult;
    }

    // Fetch from API
    const postsData = await facebookClient.getInstagramPosts(
      user.instagramId,
      user.accessToken,
      after
    );

    const result = {
      posts: postsData.data,
      nextCursor: postsData.paging?.cursors?.after,
      hasMore: !!postsData.paging?.next,
    };

    // Cache the result with cursor information
    await instagramRepository.setPostsWithCursor(user.instagramId, cacheKey, result);
    console.log(`Instagram posts fetched and cached: ${result.posts.length} posts`);

    return result;
  } catch (error) {
    console.error('Failed to get Instagram posts:', error);
    throw new Error('Failed to fetch Instagram posts');
  }
}

/**
 * Refresh Instagram data by invalidating cache
 */
export async function refreshInstagramData(): Promise<void> {
  try {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
      await initiateOAuthLogin({ redirectUrl: '/app/instagram/posts' });
      return;
    }

    // Invalidate cache
    await instagramRepository.invalidateUserCache(user.instagramId);
    console.log('Instagram cache invalidated');
  } catch (error) {
    console.error('Failed to refresh Instagram data:', error);
    throw new Error('Failed to refresh Instagram data');
  }
}

/**
 * Check if user is authenticated and has Instagram access
 */
export async function checkInstagramAccess(): Promise<{
  isAuthenticated: boolean;
  user?: {
    username: string;
    instagramId: string;
    profilePicture: string;
  };
}> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { isAuthenticated: false };
    }

    return {
      isAuthenticated: true,
      user: {
        username: user.username,
        instagramId: user.instagramId,
        profilePicture: user.profilePicture,
      },
    };
  } catch (error) {
    console.error('Failed to check Instagram access:', error);
    return { isAuthenticated: false };
  }
}
