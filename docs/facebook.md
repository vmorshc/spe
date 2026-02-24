# Facebook Graph Client

Sources: `src/lib/facebook/client.ts`, `src/lib/facebook/types.ts`, `src/lib/facebook/constants.ts`.

Purpose: Handle Facebook OAuth and Instagram Business API calls.

## Configuration

- Base URL: `https://graph.facebook.com/v22.0`.
- OAuth dialog URL: `https://www.facebook.com/v22.0/dialog/oauth`.
- OAuth scopes in `FACEBOOK_OAUTH_SCOPES` (pages, business management, Instagram read and comments).
- Uses `serverConfig.FACEBOOK_APP_ID`, `serverConfig.FACEBOOK_APP_SECRET`, and `serverConfig.FACEBOOK_REDIRECT_URI`.

## Client Methods

### `exchangeCodeForToken(code)`
Takes: `code: string`.
Returns: `Promise<FacebookTokenResponse>`.
How it works: POST to `/oauth/access_token` and returns a short-lived access token.

### `getLongLivedToken(accessToken)`
Takes: `accessToken: string` (short-lived).
Returns: `Promise<FacebookTokenResponse>`.
How it works: exchanges for a long-lived token using `fb_exchange_token`.

### `getInstagramAccounts(accessToken)`
Takes: `accessToken: string`.
Returns: `Promise<InstagramAccountWithPageInfo[]>`.
How it works: loads Facebook pages, filters those with Instagram business accounts, then fetches details per page.

### `getInstagramAccountDetails(instagramId, accessToken)`
Takes: `instagramId: string`, `accessToken: string`.
Returns: `Promise<FacebookInstagramAccountDetails>`.
How it works: fetches profile fields for a specific Instagram business account.

### `getInstagramPosts(instagramId, accessToken, after?)`
Takes: `instagramId: string`, `accessToken: string`, `after?: string`.
Returns: `Promise<InstagramMediaResponse>`.
How it works: fetches 12 posts at a time with cursor-based pagination.

### `getPostDetails(postId, accessToken)`
Takes: `postId: string`, `accessToken: string`.
Returns: `Promise<InstagramMedia>`.
How it works: fetches a single media object by ID.

### `getPostComments(postId, accessToken, after?)`
Takes: `postId: string`, `accessToken: string`, `after?: string`.
Returns: `Promise<InstagramCommentsResponse>`.
How it works: fetches 50 comments per page with cursor-based pagination.

## Key Types

- `FacebookTokenResponse` (access token payload).
- `FacebookPagesResponse`, `FacebookInstagramAccountDetails` (Graph API data).
- `InstagramAccountWithPageInfo` (merged page + IG data).
- `InstagramProfile`, `InstagramMedia`, `InstagramMediaResponse`.
- `InstagramComment`, `InstagramCommentsResponse`.
