# Auth Actions

Source: `src/lib/actions/auth.ts`

Purpose: Start OAuth login, select an Instagram profile, and manage the user session lifecycle.

## Methods

### `initiateOAuthLogin(options?)`
Takes: `options?: { redirectUrl?: string }`.
Returns: `Promise<never>` (redirects to Facebook OAuth).
How it works: validates optional `redirectUrl`, generates and stores OAuth state, builds OAuth URL, then redirects.

### `getOAuthLoginURL()`
Takes: no params.
Returns: `Promise<string>` OAuth URL.
How it works: generates and stores OAuth state, builds OAuth URL, and returns it without redirecting.

### `getTempProfileData(tempId)`
Takes: `tempId: string`.
Returns: `Promise<TempProfileData | null>`.
How it works: loads temporary profile data from Redis; returns `null` on errors.

### `selectInstagramProfile(tempId, pageId)`
Takes: `tempId: string`, `pageId: string`.
Returns: `Promise<{ redirectUrl?: string }>`.
How it works: loads temp data, finds selected profile, creates Redis session, stores session ID in cookie, deletes temp data.

### `getCurrentUser()`
Takes: no params.
Returns: `Promise<UserSession | null>`.
How it works: reads session ID from cookie and fetches session from Redis.

### `isAuthenticated()`
Takes: no params.
Returns: `Promise<boolean>`.
How it works: calls `getCurrentUser()` and checks for non-null.

### `logout()`
Takes: no params.
Returns: `Promise<void>`.
How it works: deletes Redis session (if any) and clears session cookie.

### `refreshAuthState()`
Takes: no params.
Returns: `Promise<UserSession | null>`.
How it works: wrapper around `getCurrentUser()`.
