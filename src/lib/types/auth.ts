/**
 * Shared authentication types for both server and client components
 */

export interface UserSession {
  sessionId: string;
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  mediaCount: number;
  accessToken: string;
  pageId: string;
  pageName: string;
  createdAt: string;
  expiresAt: string;
}

export interface TempProfileData {
  tempId: string;
  profiles: Array<{
    instagramId: string;
    username: string;
    profilePicture: string;
    followersCount: number;
    mediaCount: number;
    pageId: string;
    pageName: string;
    pageAccessToken: string;
  }>;
  longLivedToken: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}
