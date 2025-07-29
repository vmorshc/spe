import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { serverConfig } from '@/config/server';

/**
 * Session data structure - simplified to only store session ID
 */
export interface SessionData {
  sessionId?: string; // Only store the Redis session ID
  oauthState?: string; // Temporary, only during OAuth flow
  redirectUrl?: string; // Redirect URL after successful authentication
  featureFlags?: Record<string, boolean>; // Feature flags for this session
}

/**
 * Iron session configuration
 */
const sessionOptions = {
  password: serverConfig.SESSION_SECRET,
  cookieName: 'pickly-session',
  cookieOptions: {
    secure: serverConfig.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
};

/**
 * Get the current session
 */
export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}

/**
 * Set OAuth state in session
 */
export async function setOAuthState(state: string): Promise<void> {
  const session = await getSession();
  session.oauthState = state;
  await session.save();
}

/**
 * Get OAuth state from session
 */
export async function getOAuthState(): Promise<string | undefined> {
  const session = await getSession();
  return session.oauthState;
}

/**
 * Clear OAuth state from session
 */
export async function clearOAuthState(): Promise<void> {
  const session = await getSession();
  session.oauthState = undefined;
  await session.save();
}

/**
 * Set session ID after successful authentication
 */
export async function setSessionId(sessionId: string): Promise<void> {
  const session = await getSession();
  session.sessionId = sessionId;
  await session.save();
}

/**
 * Get session ID
 */
export async function getSessionId(): Promise<string | undefined> {
  const session = await getSession();
  return session.sessionId;
}

/**
 * Clear session ID (logout)
 */
export async function clearSessionId(): Promise<void> {
  const session = await getSession();
  session.sessionId = undefined;
  session.oauthState = undefined;
  await session.save();
}

/**
 * Set redirect URL in session
 */
export async function setRedirectUrl(redirectUrl: string): Promise<void> {
  const session = await getSession();
  session.redirectUrl = redirectUrl;
  await session.save();
}

/**
 * Get redirect URL from session
 */
export async function getRedirectUrl(): Promise<string | undefined> {
  const session = await getSession();
  return session.redirectUrl;
}

/**
 * Clear redirect URL from session
 */
export async function clearRedirectUrl(): Promise<void> {
  const session = await getSession();
  session.redirectUrl = undefined;
  await session.save();
}

/**
 * Get feature flags from session
 */
export async function getFeatureFlagsFromSession(): Promise<Record<string, boolean> | undefined> {
  const session = await getSession();
  return session.featureFlags;
}

/**
 * Set a specific feature flag in session
 */
export async function setFeatureFlagInSession(flagName: string, value: boolean): Promise<void> {
  const session = await getSession();

  // Initialize featureFlags object if it doesn't exist
  if (!session.featureFlags) {
    session.featureFlags = {};
  }

  session.featureFlags[flagName] = value;
  await session.save();
}

/**
 * Set multiple feature flags in session
 */
export async function setFeatureFlagsInSession(
  flags: Partial<Record<string, boolean>>
): Promise<void> {
  const session = await getSession();

  // Initialize featureFlags object if it doesn't exist
  if (!session.featureFlags) {
    session.featureFlags = {};
  }

  // Update each flag
  Object.entries(flags).forEach(([flagName, value]) => {
    if (value !== undefined) {
      session.featureFlags![flagName] = value;
    }
  });

  await session.save();
}

/**
 * Reset feature flags to given defaults in session
 */
export async function resetFeatureFlagsInSession(
  defaultFlags: Record<string, boolean>
): Promise<void> {
  const session = await getSession();
  session.featureFlags = defaultFlags;
  await session.save();
}
