'use server';

import { redirect } from 'next/navigation';
import { clearSessionId, getSessionId, setOAuthState, setSessionId } from '@/lib/auth/session';
import { buildOAuthURL, generateState } from '@/lib/auth/utils';
import { userRepository } from '@/lib/redis/repositories/users';
import type { TempProfileData, UserSession } from '@/lib/types/auth';

/**
 * Initiate OAuth login flow
 * Generates state, stores it in session, and redirects to Facebook OAuth
 */
export async function initiateOAuthLogin(): Promise<never> {
  let oauthURL: string;
  try {
    // Generate cryptographically secure state parameter
    const state = generateState();

    // Store state in session for later validation
    await setOAuthState(state);

    // Build OAuth URL with state parameter
    oauthURL = buildOAuthURL(state);

    console.log('OAuth login initiated:', {
      state,
      redirectUri: oauthURL,
    });
  } catch (error) {
    console.error('Failed to initiate OAuth login:', error);
    throw new Error('OAuth login initiation failed');
  }

  // Redirect to Facebook OAuth page
  redirect(oauthURL);
}

/**
 * Get OAuth login URL without redirecting
 * Useful for client-side redirects
 */
export async function getOAuthLoginURL(): Promise<string> {
  try {
    // Generate cryptographically secure state parameter
    const state = generateState();

    // Store state in session for later validation
    await setOAuthState(state);

    // Build OAuth URL with state parameter
    const oauthURL = buildOAuthURL(state);

    console.log('OAuth URL generated:', {
      state,
      redirectUri: oauthURL,
    });

    return oauthURL;
  } catch (error) {
    console.error('Failed to generate OAuth URL:', error);
    throw new Error('OAuth URL generation failed');
  }
}

/**
 * Get temporary profile data for selection
 */
export async function getTempProfileData(tempId: string): Promise<TempProfileData | null> {
  try {
    const data = await userRepository.getTempProfileData(tempId);
    return data;
  } catch (error) {
    console.error('Failed to get temporary profile data:', error);
    return null;
  }
}

/**
 * Complete profile selection and create user session
 */
export async function selectInstagramProfile(tempId: string, pageId: string): Promise<void> {
  try {
    // Get temporary profile data
    const tempData = await userRepository.getTempProfileData(tempId);
    if (!tempData) {
      throw new Error('Temporary profile data not found or expired');
    }

    // Find the selected profile
    const selectedProfile = tempData.profiles.find((profile) => profile.pageId === pageId);
    if (!selectedProfile) {
      throw new Error('Selected profile not found');
    }

    // Create user session in Redis
    const sessionId = await userRepository.createSession({
      instagramId: selectedProfile.instagramId,
      username: selectedProfile.username,
      profilePicture: selectedProfile.profilePicture,
      followersCount: selectedProfile.followersCount,
      mediaCount: selectedProfile.mediaCount,
      accessToken: tempData.longLivedToken,
      pageId: selectedProfile.pageId,
      pageName: selectedProfile.pageName,
    });

    // Store session ID in cookie
    await setSessionId(sessionId);

    // Clean up temporary data
    await userRepository.deleteTempProfileData(tempId);

    console.log('Profile selection completed:', {
      sessionId,
      username: selectedProfile.username,
      pageId: selectedProfile.pageId,
    });
  } catch (error) {
    console.error('Failed to select Instagram profile:', error);
    throw new Error('Profile selection failed');
  }
}

/**
 * Get current user session
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      return null;
    }

    const session = await userRepository.getSession(sessionId);
    return session;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch (error) {
    console.error('Failed to check authentication:', error);
    return false;
  }
}

/**
 * Logout user and clear session
 */
export async function logout(): Promise<void> {
  try {
    const sessionId = await getSessionId();
    if (sessionId) {
      await userRepository.deleteSession(sessionId);
    }
    await clearSessionId();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Failed to logout user:', error);
    throw new Error('Logout failed');
  }
}

/**
 * Refresh authentication state - useful for client-side auth checks
 */
export async function refreshAuthState(): Promise<UserSession | null> {
  try {
    return await getCurrentUser();
  } catch (error) {
    console.error('Failed to refresh auth state:', error);
    return null;
  }
}
