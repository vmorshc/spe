import { serverConfig } from '@/config/server';
import {
  FACEBOOK_OAUTH_AUTH_TYPE,
  FACEBOOK_OAUTH_RESPONSE_TYPE,
  FACEBOOK_OAUTH_SCOPE_STRING,
  FACEBOOK_OAUTH_URL,
} from '@/lib/facebook/constants';

/**
 * Generate a cryptographically secure random state parameter for OAuth
 */
export function generateState(): string {
  // Generate 32 random bytes and convert to hex
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Build Facebook OAuth URL with all required parameters
 */
export function buildOAuthURL(state: string): string {
  const params = new URLSearchParams({
    client_id: serverConfig.FACEBOOK_APP_ID,
    redirect_uri: serverConfig.FACEBOOK_REDIRECT_URI,
    state,
    response_type: FACEBOOK_OAUTH_RESPONSE_TYPE,
    auth_type: FACEBOOK_OAUTH_AUTH_TYPE,
    scope: FACEBOOK_OAUTH_SCOPE_STRING,
  });

  return `${FACEBOOK_OAUTH_URL}?${params.toString()}`;
}

/**
 * Validate OAuth state parameter
 */
export function validateState(receivedState: string, storedState: string): boolean {
  if (!receivedState || !storedState) {
    return false;
  }

  // Use constant-time comparison to prevent timing attacks
  if (receivedState.length !== storedState.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < receivedState.length; i++) {
    result |= receivedState.charCodeAt(i) ^ storedState.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Validate redirect URL for security
 * Only allows relative URLs to prevent open redirect attacks
 */
export function validateRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Must start with forward slash (relative URL)
  if (!trimmedUrl.startsWith('/')) {
    return false;
  }

  // Cannot contain protocol schemes
  if (trimmedUrl.includes('://')) {
    return false;
  }

  // Cannot start with double slashes (protocol-relative URLs)
  if (trimmedUrl.startsWith('//')) {
    return false;
  }

  // Cannot contain dangerous patterns
  const dangerousPatterns = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'ftp:',
    'mailto:',
    'tel:',
  ];

  const lowerUrl = trimmedUrl.toLowerCase();
  for (const pattern of dangerousPatterns) {
    if (lowerUrl.includes(pattern)) {
      return false;
    }
  }

  return true;
}

/**
 * Sanitize redirect URL
 * Returns a safe relative URL or default fallback
 */
export function sanitizeRedirectUrl(
  url: string | null | undefined,
  fallback: string = '/'
): string {
  if (!url || !validateRedirectUrl(url)) {
    return fallback;
  }

  return url.trim();
}
