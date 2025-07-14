# Facebook/Instagram OAuth Implementation - Project Context

## Overview
This document describes the complete implementation of Facebook/Instagram OAuth authentication for the Sure Pick Engine (SPE) project - a Ukrainian-language web application for conducting transparent Instagram giveaways. The implementation allows users to authenticate with their Instagram Business accounts through Facebook OAuth.

The OAuth system was implemented in stages:
1. Basic OAuth flow with state validation
2. Token exchange and profile selection
3. Bug fixes and improvements
4. Redirect URL support for protected routes

All functionality is now complete and production-ready.

## Key Features
- ✅ **Secure OAuth Flow**: CSRF-protected authentication with Facebook/Instagram
- ✅ **Profile Selection**: Users can choose from multiple Instagram Business accounts
- ✅ **Session Management**: Redis-based sessions with 24-hour TTL
- ✅ **Global Auth State**: React Context for consistent authentication across components
- ✅ **Redirect URLs**: Support for returning users to their original destination
- ✅ **Error Handling**: Comprehensive error messages in Ukrainian
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Next.js 15**: Compatible with latest Next.js features including Suspense

## Project Status
- **Stage 1**: ✅ OAuth initiation and callback validation - COMPLETE
- **Stage 2**: ✅ Token exchange and profile selection - COMPLETE
- **Bug Fixes**: ✅ Authentication state synchronization, type deduplication, Suspense boundaries - COMPLETE
- **Enhancement**: ✅ Redirect URL support - COMPLETE

## Technical Stack Integration
- Next.js 15 with App Router
- TypeScript with strict mode
- Iron-session for secure cookie-based sessions
- Redis for session storage (24-hour TTL)
- Facebook Graph API v22.0
- Zod for validation
- Framer Motion for animations

## Authentication Flow

### Complete User Journey
1. **Login Initiation**: User clicks "Увійти через Instagram" (optionally with redirect URL) → generates CSRF state → redirects to Facebook OAuth
2. **Facebook Authorization**: User grants permissions for required scopes
3. **Callback Processing**: Validates state → exchanges code for access token
4. **Token Exchange**: Short-lived token → long-lived token (60 days)
5. **Profile Fetching**: Retrieves Facebook Pages with Instagram Business Accounts
6. **Profile Selection**: User selects Instagram profile from available options
7. **Session Creation**: Stores session in Redis → sets session ID cookie → authenticated state
8. **Final Redirect**: Redirects to originally requested URL (if provided) or home page

### OAuth Scopes Required
- `pages_show_list` - Access to Facebook pages
- `business_management` - Business account management
- `instagram_basic` - Basic Instagram access
- `instagram_manage_comments` - Comment access for giveaways
- `pages_read_engagement` - Read page engagement data
- `public_profile` - Basic profile information

## File Structure and Components

### Configuration Files
```
src/config/
├── shared.ts         # Added FACEBOOK_REDIRECT_PATH
├── client.ts         # Added DOMAIN from NEXT_PUBLIC_DOMAIN
├── server.ts         # Dynamic redirect URI building
└── index.ts          # Removed server config exports for security

src/lib/env.ts        # Added NEXT_PUBLIC_DOMAIN validation
```

### Facebook Integration
```
src/lib/facebook/
├── constants.ts      # OAuth URLs, API version, scopes
├── types.ts          # TypeScript interfaces for API responses
└── client.ts         # Facebook Graph API client class
```

### Authentication System
```
src/lib/auth/
├── session.ts        # Iron-session configuration (supports redirectUrl storage)
└── utils.ts          # OAuth utilities (includes URL validation for redirects)

src/lib/types/
└── auth.ts           # Shared authentication types (UserSession, TempProfileData, AuthContextType)

src/lib/contexts/
└── AuthContext.tsx   # Global authentication state management

src/lib/actions/
└── auth.ts           # Server actions for OAuth flow (supports redirect URLs)
```

### Redis Integration
```
src/lib/redis/repositories/
└── users.ts          # User session repository with 24-hour TTL
```

### UI Components
```
src/components/auth/
├── LoginButton.tsx   # OAuth login button with Instagram branding (supports redirectUrl)
└── UserProfile.tsx   # User profile display with dropdown menu

src/components/landing/
└── Header.tsx        # Updated to show LoginButton/UserProfile based on auth state
```

### Pages and Routes
```
src/app/
├── layout.tsx                      # Added AuthProvider wrapper
├── auth/
│   ├── callback/route.ts          # OAuth callback handler
│   ├── select-profile/page.tsx    # Instagram profile selection
│   └── error/page.tsx             # Authentication error handling
```

## Key Technical Decisions

### Security Architecture
1. **Session Storage**: Only session ID stored in cookies, all sensitive data in Redis
2. **CSRF Protection**: Cryptographically secure state parameter with constant-time comparison
3. **Token Management**: Long-lived tokens stored server-side only
4. **URL Validation**: Strict validation to prevent open redirect attacks

### Data Models

#### SessionData (Iron-session cookie)
```typescript
interface SessionData {
  sessionId?: string;     // Redis session ID
  oauthState?: string;    // Temporary during OAuth flow
  redirectUrl?: string;   // Optional redirect after auth
}
```

#### UserSession (Redis, 24-hour TTL)
```typescript
interface UserSession {
  sessionId: string;
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  mediaCount: number;
  accessToken: string;      // Long-lived token
  pageId: string;
  pageName: string;
  createdAt: string;
  expiresAt: string;
}
```

#### TempProfileData (Redis, 5-minute TTL)
```typescript
interface TempProfileData {
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
  redirectUrl?: string;     // Optional redirect URL
  createdAt: string;
  expiresAt: string;
}
```

### State Management
- **AuthProvider Context**: Global authentication state with useAuth() hook
- **Automatic Sync**: All components update instantly on login/logout
- **Server Actions**: Direct server-to-server API calls without exposing endpoints

## Implementation Details

### Facebook API Client Methods
- `exchangeCodeForToken(code: string)` - Exchanges authorization code for access token
- `getLongLivedToken(accessToken: string)` - Gets 60-day token
- `getInstagramAccounts(accessToken: string)` - Fetches Instagram Business Accounts with details

### User Repository Methods
- `createSession(data)` - Creates user session with 24-hour TTL
- `getSession(sessionId)` - Retrieves session by ID
- `deleteSession(sessionId)` - Removes session (logout)
- `storeTempProfileData(data)` - Temporary storage during OAuth flow (5-minute TTL)

### Server Actions
- `initiateOAuthLogin(options?: { redirectUrl?: string })` - Starts OAuth flow with state generation and optional redirect
- `getCurrentUser()` - Gets current user session
- `logout()` - Clears session and cookies
- `selectInstagramProfile(tempId, pageId)` - Completes profile selection
- `getTempProfileData(tempId)` - Retrieves profiles for selection page

## Problems Solved

### 1. Authentication State Synchronization
**Problem**: Header showed stale auth state after logout
**Solution**: Created AuthProvider context for global state management

### 2. Type Duplication
**Problem**: UserSession interface duplicated across multiple files
**Solution**: Created shared types file (`src/lib/types/auth.ts`) safe for both client and server

### 3. Next.js 15 Compatibility
**Problem**: useSearchParams() requires Suspense boundary
**Solution**: Wrapped components using useSearchParams() in Suspense with loading fallbacks

### 4. Security Separation
**Problem**: Client components importing server-side repository code
**Solution**: Moved shared types to separate file, keeping server logic isolated

### 5. Protected Routes Support
**Problem**: No way to return users to their original destination after login
**Solution**: Implemented redirect URL functionality with secure validation

## Environment Variables Required
```env
# Facebook OAuth
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Session Security
SESSION_SECRET=32_character_minimum_secret

# Redis (Optional - app functions without it)
REDIS_URL=redis://localhost:6379

# Public Configuration
NEXT_PUBLIC_DOMAIN=https://yourdomain.com
NEXT_PUBLIC_NODE_ENV=production
```

## API Endpoints Used

### Facebook Graph API v22.0
1. **OAuth Dialog**: `https://www.facebook.com/v22.0/dialog/oauth`
2. **Token Exchange**: `POST https://graph.facebook.com/v22.0/oauth/access_token`
3. **Get Pages**: `GET https://graph.facebook.com/v22.0/me/accounts`
4. **Get Instagram Details**: `GET https://graph.facebook.com/v22.0/{instagram-id}`

## Error Handling

### OAuth Errors
- `access_denied` - User denied permissions
- `invalid_state` - CSRF state validation failed
- `no_instagram_accounts` - No Instagram Business accounts found
- `token_exchange_failed` - Facebook API error

### User-Friendly Messages
All errors display in Ukrainian with helpful instructions for users.

## Performance Optimizations
- Redis caching with appropriate TTLs
- Minimal cookie payload (only session ID)
- Server-side API calls (no client exposure)
- Optimized loading states with Suspense

## Redirect URL Support ✅

### Implemented Functionality
Added optional redirect URL parameter to OAuth flow that returns users to their original destination after authentication.

### Features
- Optional `redirectUrl` parameter in `initiateOAuthLogin()`
- Secure URL validation (only relative paths allowed)
- Redirect URL preserved through entire OAuth flow
- Stored in session and passed through temporary Redis data
- Automatic redirect after profile selection

### Security Implementation
- Only relative URLs allowed (must start with `/`)
- External URLs and protocols blocked
- Validation against dangerous patterns (javascript:, data:, //)
- Protection against open redirect attacks

### Use Cases
- Protected routes requiring authentication
- Preserving user context (e.g., creating a giveaway)
- Better UX by maintaining user intent
- Seamless flow for authenticated-only features

### API Usage
```typescript
// Simple usage
await initiateOAuthLogin({ redirectUrl: '/giveaway/create' });

// In LoginButton component
<LoginButton redirectUrl="/dashboard" />
```

## Testing Checklist
- [x] OAuth flow completes successfully
- [x] Profile selection displays all Instagram accounts
- [x] Session persists for 24 hours
- [x] Logout clears all session data
- [x] Error states handled gracefully
- [x] TypeScript types pass validation
- [x] Build completes without errors
- [x] Authentication state syncs across components
- [x] Redirect URL works with valid paths
- [x] Invalid redirect URLs are properly rejected
- [x] Redirect persists through OAuth flow

## Current Limitations
- Long-lived tokens expire after 60 days (Facebook limitation)
- Requires Instagram Business Account connected to Facebook Page

## Security Considerations
- All tokens stored server-side only
- CSRF protection on all state-changing operations
- Strict URL validation to prevent open redirects
- Redirect URLs limited to relative paths only
- Protection against protocol injection (javascript:, data:)
- Secure cookie configuration (httpOnly, sameSite)
- No sensitive data exposed to client

## Development Notes
- Use `pnpm dev` for development with Turbopack
- Authentication state available via `useAuth()` hook
- Server actions handle all API communication
- Ukrainian UI text, English code/comments
- Follows existing project patterns and conventions
- All OAuth functionality including redirect URLs is fully implemented and tested

## Integration Points
This OAuth system integrates with:
- Existing Redis infrastructure
- Current UI component library
- Project configuration system
- Error handling patterns
- TypeScript type system

The implementation is production-ready and provides a secure, user-friendly authentication experience for Instagram Business account holders.