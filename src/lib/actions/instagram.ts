'use server';

import { facebookClient } from '@/lib/facebook/client';
import type {
  FacebookInstagramAccountDetails,
  InstagramComment,
  InstagramMedia,
  InstagramProfile,
} from '@/lib/facebook/types';
import { instagramRepository } from '@/lib/redis/repositories/instagram';
import { getCurrentUser, initiateOAuthLogin } from './auth';

export interface InstagramCommentsResult {
  comments: InstagramComment[];
  nextCursor: string | null;
}

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

/**
 * Get post details with caching
 */
export async function getPostDetailsAction(postId: string): Promise<InstagramMedia> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check cache first
    const cachedPost = await instagramRepository.getPostDetails(postId);
    if (cachedPost) {
      console.log('Post details cache hit');
      return cachedPost;
    }

    // Fetch from API
    const postDetails = await facebookClient.getPostDetails(postId, user.accessToken);

    // Cache the result
    await instagramRepository.setPostDetails(postId, postDetails);
    console.log('Post details fetched and cached');

    return postDetails;
  } catch (error) {
    console.error('Failed to get post details:', error);
    throw new Error('Failed to fetch post details');
  }
}

/**
 * Get paginated comments with cursor support
 */
export async function getCommentsAction(
  postId: string,
  cursor?: string
): Promise<InstagramCommentsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check cache first
    const cachedComments = await instagramRepository.getComments(postId, cursor);
    if (cachedComments) {
      console.log('Comments cache hit');
      return cachedComments;
    }

    // Fetch from API
    const commentsData = await facebookClient.getPostComments(postId, user.accessToken, cursor);

    const nextCursor = commentsData.paging?.cursors?.after || null;

    const result = {
      comments: commentsData.data,
      nextCursor: nextCursor,
    };

    // Cache the result
    await instagramRepository.setComments(postId, cursor || null, result);
    console.log(`Comments fetched and cached: ${result.comments.length} comments`);

    return result;
  } catch (error) {
    console.error('Failed to get comments:', error);
    throw new Error('Failed to fetch comments');
  }
}

/**
 * Refresh comments (clear cache)
 */
export async function refreshCommentsAction(postId: string): Promise<InstagramCommentsResult> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Invalidate comments cache
    await instagramRepository.invalidateCommentsCache(postId);

    // Fetch fresh data
    return await getCommentsAction(postId);
  } catch (error) {
    console.error('Failed to refresh comments:', error);
    throw new Error('Failed to refresh comments');
  }
}

/**
 * Export comments to CSV
 */
export async function exportCsvAction(postId: string): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const allComments: InstagramComment[] = [];
    let cursor: string | null = null;
    let pageCount = 0;
    const maxPages = 100; // Limit to prevent infinite loops

    // Fetch all comments
    while (pageCount < maxPages) {
      const commentsData = await getCommentsAction(postId, cursor || undefined);
      const comments = commentsData.comments;
      if (comments.length !== 0) {
        allComments.push(...comments);
      } else {
        break;
      }
      if (commentsData.nextCursor) {
        cursor = commentsData.nextCursor;
      } else {
        break;
      }
      pageCount++;
    }

    if (allComments.length === 0) {
      throw new Error('No comments found to export');
    }

    // Create CSV content
    const csvHeader = 'id,username,text,created_time,like_count\n';
    const csvRows = allComments
      .map((comment) => {
        const escapedText = comment.text.replace(/"/g, '""');
        return `"${comment.id}","${comment.username}","${escapedText}","${comment.timestamp}","${comment.like_count}"`;
      })
      .join('\n');

    const csvContent = csvHeader + csvRows;

    // Create response with CSV data
    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="instagram_comments_${postId}.csv"`,
      },
    });
  } catch (error) {
    console.error('Failed to export CSV:', error);
    throw new Error('Failed to export comments to CSV');
  }
}

/**
 * Placeholder for winner selection
 */
export async function pickWinnerAction(postId: string): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // TODO: Implement winner selection logic
    console.log(`Winner selection requested for post ${postId} by user ${user.username}`);

    // For now, this is a no-op as requested in the requirements
    // In the future, this could randomly select a comment/user from the post
  } catch (error) {
    console.error('Failed to pick winner:', error);
    throw new Error('Failed to pick winner');
  }
}
