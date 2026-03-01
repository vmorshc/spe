# OAuth Implementation

Facebook/Instagram OAuth for authenticating Instagram Business accounts.

## Flow

1. User clicks login → CSRF state generated → redirect to Facebook OAuth
2. Facebook authorization → callback validates state → exchanges code for token
3. Short-lived token → long-lived token (60 days)
4. Fetch Instagram Business Accounts from Facebook Pages
5. User selects Instagram profile → session created in Redis (24h TTL)
6. Redirect to original URL (if provided) or home page

## Required Scopes

`pages_show_list`, `business_management`, `instagram_basic`, `instagram_manage_comments`, `pages_read_engagement`, `public_profile`

## Key Files

| Area | Files |
|------|-------|
| Facebook API client | `src/lib/facebook/client.ts`, `constants.ts`, `types.ts` |
| Auth logic | `src/lib/actions/auth.ts`, `src/lib/auth/session.ts`, `src/lib/auth/utils.ts` |
| Auth types | `src/lib/types/auth.ts` |
| Auth context | `src/lib/contexts/AuthContext.tsx` |
| Session storage | `src/lib/redis/repositories/users.ts` |
| OAuth callback | `src/app/auth/callback/route.ts` |
| Profile selection | `src/app/auth/select-profile/page.tsx` |
| Error page | `src/app/auth/error/page.tsx` |
| UI | `src/components/auth/LoginButton.tsx`, `UserProfile.tsx` |

## Session Architecture

- **Cookie** (Iron Session): stores only `sessionId`, `oauthState`, `redirectUrl`
- **Redis** (24h TTL): stores full `UserSession` (tokens, profile data)
- **Temp data** (5min TTL): `TempProfileData` during profile selection step
- Global auth state via `AuthProvider` / `useAuth()` hook

## Security

- Tokens stored server-side only (Redis), never exposed to client
- CSRF state with constant-time comparison
- Redirect URLs: only relative paths, validated against open redirect attacks
- Secure cookies: httpOnly, sameSite

## Server Actions

- `initiateOAuthLogin({ redirectUrl? })` — start OAuth flow
- `getCurrentUser()` — get session from Redis
- `logout()` — clear session and cookies
- `selectInstagramProfile(tempId, pageId)` — complete profile selection
- `getTempProfileData(tempId)` — get profiles during selection

## Facebook Graph API (v22.0)

- OAuth Dialog: `facebook.com/v22.0/dialog/oauth`
- Token Exchange: `graph.facebook.com/v22.0/oauth/access_token`
- Pages: `graph.facebook.com/v22.0/me/accounts`
- Instagram Details: `graph.facebook.com/v22.0/{instagram-id}`

## Limitations

- Long-lived tokens expire after 60 days (Facebook limitation)
- Requires Instagram Business Account connected to a Facebook Page
