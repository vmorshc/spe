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
}

/**
 * Iron session configuration
 */
const sessionOptions = {
  password: serverConfig.SESSION_SECRET,
  cookieName: 'spe-session',
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
