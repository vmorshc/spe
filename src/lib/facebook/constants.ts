/**
 * Facebook API constants and configuration
 */

// Facebook API version
export const FACEBOOK_API_VERSION = 'v22.0';

// Facebook OAuth URL
export const FACEBOOK_OAUTH_URL = `https://www.facebook.com/${FACEBOOK_API_VERSION}/dialog/oauth`;

// Facebook Graph API base URL
export const FACEBOOK_GRAPH_API_BASE_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

// Required OAuth scopes for Instagram Business access
export const FACEBOOK_OAUTH_SCOPES = [
  'pages_show_list',
  'business_management',
  'instagram_basic',
  'instagram_manage_comments',
  'pages_read_engagement',
  'public_profile',
] as const;

// Scope string for OAuth URL
export const FACEBOOK_OAUTH_SCOPE_STRING = FACEBOOK_OAUTH_SCOPES.join(',');

// OAuth response type
export const FACEBOOK_OAUTH_RESPONSE_TYPE = 'code';

// OAuth auth type for re-request
export const FACEBOOK_OAUTH_AUTH_TYPE = 'rerequest';
