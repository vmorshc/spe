# Instagram Actions

Source: `src/lib/actions/instagram.ts`

Purpose: Fetch Instagram profile, posts, post details, and recent comments with Redis caching.

## Methods

### `getInstagramProfile()`
Takes: no params.
Returns: `Promise<InstagramProfile | null>`.
How it works: checks auth, reads cache, fetches from Facebook API if needed, then caches the profile.

### `getInstagramPosts(after?)`
Takes: `after?: string` cursor.
Returns: `Promise<{ posts: InstagramMedia[]; nextCursor?: string; hasMore: boolean }>`.
How it works: checks auth, reads cache by cursor, fetches from Facebook API if needed, then caches results.

### `refreshInstagramData()`
Takes: no params.
Returns: `Promise<void>`.
How it works: if unauthenticated, starts OAuth with a redirect back to `/app/instagram/posts`; otherwise invalidates Redis cache.

### `checkInstagramAccess()`
Takes: no params.
Returns: `Promise<{ isAuthenticated: boolean; user?: { username; instagramId; profilePicture } }>`.
How it works: returns a minimal user summary when a session exists.

### `getPostDetailsAction(postId)`
Takes: `postId: string`.
Returns: `Promise<InstagramMedia>`.
How it works: reads cached post details, otherwise fetches from Facebook API and caches it.

### `getLastCommentsAction(postId, cache?)`
Takes: `postId: string`, `cache: boolean = true`.
Returns: `Promise<{ comments: InstagramComment[] }>`.
How it works: optionally reads cached comments, otherwise fetches from Facebook API and caches them.

### `pickWinnerAction(postId)`
Takes: `postId: string`.
Returns: `Promise<void>`.
How it works: placeholder only; currently logs the request and performs no selection.
