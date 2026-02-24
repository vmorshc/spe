# Data Models & Redis Schema

## Session Data Model

### UserSession
```typescript
interface UserSession {
  sessionId: string;           // UUID v4
  instagramId: string;         // Instagram Business account ID
  username: string;            // Instagram username
  profilePicture: string;      // Profile picture URL
  followersCount: number;      // Follower count at auth time
  mediaCount: number;          // Post count at auth time
  accessToken: string;         // Long-lived Facebook token (60 days)
  pageId: string;              // Facebook page ID
  pageName: string;            // Facebook page name
  createdAt: string;           // ISO timestamp
  expiresAt: string;           // ISO timestamp (24 hours)
}
```

**Storage**: Redis `user:session:{sessionId}` with 24h TTL
**Usage**: Loaded on every authenticated request via session cookie

### TempProfileData
```typescript
interface TempProfileData {
  tempId: string;              // UUID v4
  profiles: InstagramAccountWithPageInfo[];
  accessToken: string;         // Long-lived token
  redirectUrl?: string;        // Post-auth redirect
}
```

**Storage**: Redis `user:temp:{tempId}` with 5m TTL
**Usage**: OAuth callback stores this temporarily until user selects profile

## Instagram Data Models

### InstagramProfile
```typescript
interface InstagramProfile {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  website?: string;
  profile_picture_url?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}
```

**Storage**: Redis `instagram:profile:{instagramId}` with 5m TTL
**Usage**: Displayed on profile header, refreshed on demand

### InstagramMedia
```typescript
interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  children?: { data: Array<{ id: string; media_url: string }> };
}
```

**Storage**:
- Posts list: `instagram:posts:{instagramId}:{cursor}` with 5m TTL
- Post details: `instagram:post:{postId}` with 5m TTL

**Usage**: Posts grid, post details page, giveaway wizard

## Export Data Models

### ExportRecord
```typescript
interface ExportRecord {
  exportId: string;            // UUID v4
  status: 'pending' | 'running' | 'csv_pending' | 'done' | 'failed';

  owner: {
    instagramId: string;
    username: string;
  };

  post: {
    mediaId: string;
    permalink: string;
    caption?: string;
  };

  igPaging: {
    nextCursor?: string;       // Instagram API cursor
  };

  counters: {
    fetched: number;           // Total fetched from API
    appended: number;          // Actually stored (after dedupe)
    skippedDupes: number;      // Skipped duplicate comment IDs
  };

  list: {
    key: string;               // Redis list key
  };

  file: {
    csvReady: boolean;
    sizeBytes?: number;
  };

  error?: {
    message: string;
    code?: string;
  };

  createdAt: string;           // ISO timestamp
  startedAt?: string;
  finishedAt?: string;
}
```

**Storage**: Redis `igexp:{exportId}` with 7d TTL
**Usage**: Export job tracking, progress display, CSV generation

### NormalizedComment
```typescript
interface NormalizedComment {
  commentId: string;           // Instagram comment ID
  userId: string;              // Instagram user ID
  username: string;            // Instagram username
  timestamp: string;           // ISO timestamp
  likeCount: number;
  parentCommentId?: string;    // For replies
  text: string;                // Comment text
}
```

**Storage**: Redis list `igexp:{exportId}:comments` with 3d TTL
**Usage**: Stored during export, read for CSV generation

## Redis Key Patterns

### User & Sessions
- `user:session:{sessionId}` - TTL 24h - UserSession data
- `user:temp:{tempId}` - TTL 5m - Temp OAuth data before profile selection

### Instagram Cache
- `instagram:profile:{instagramId}` - TTL 5m - Profile details
- `instagram:posts:{instagramId}:{cursor}` - TTL 5m - Posts list by cursor
- `instagram:post:{postId}` - TTL 5m - Single post details
- `instagram:comments:{postId}` - TTL 5m - Recent comments (50 latest)

### Export Records
- `igexp:{exportId}` - TTL 7d - Export record
- `igexp:{exportId}:comments` - TTL 3d - List of NormalizedComment (JSON)
- `igexp:{exportId}:dedupe:comments` - TTL 3d - Set of comment IDs
- `igexp:index:media:{mediaId}` - TTL 14d - Set of export IDs for media
- `igexp:index:user:{instagramId}` - TTL 14d - Set of export IDs for user

### Counters
- `counter:{counterName}` - No TTL - Persistent counter (e.g., `landing-visits`)

### Rate Limiting
- `newsletter_rate_limit:{identifier}` - TTL 3600s - Sliding window rate limit

## Feature Flags Storage

Feature flags are stored in the session cookie (not Redis) as part of `SessionData.featureFlags`:

```typescript
interface SessionData {
  sessionId?: string;
  featureFlags?: Record<string, boolean>;
}
```

Current flags:
- `instagram_mvp` (default: false)

## Giveaway Data Models

### WinnerSelection
```typescript
interface WinnerSelection {
  postId: string;
  postCaption?: string;
  postPermalink: string;
  totalComments: number;
  totalParticipants: number;

  filters: {
    firstPerAuthor: boolean;
    excludeReplies: boolean;
  };

  seed: {
    clientSeed: string;        // Client-generated random hex
    serverHash: string;        // SHA-256 hash for verification
  };

  winner: {
    commentId: string;
    username: string;
    userId: string;
    text: string;
    timestamp: string;
    selectedIndex: number;
  };

  timestamp: string;
}
```

**Storage**: Currently not persisted (future enhancement)
**Usage**: Displayed in wizard step 4 with audit trail

## Data Lifecycle

### Session Lifecycle
1. Created during `selectInstagramProfile()`
2. Extended on each authenticated request (sliding 24h window)
3. Deleted on `logout()` or automatic expiration

### Export Lifecycle
1. Created with `startExportAction()` - status: `pending`
2. `resumeExportAction()` moves to `running`, fetches comments in batches
3. When complete, moves to `csv_pending` then `done`
4. Export record expires after 7 days, comments after 3 days

### Cache Lifecycle
- Instagram profile/posts cache expires after 5 minutes
- Can be manually invalidated via `refreshInstagramData()`
- Gracefully handles Redis unavailability by fetching fresh data

## Migration Notes

**Current State**: Redis-only storage with TTL-based expiration
**Future State**: PostgreSQL for persistent data (exports, winners, analytics)

Migration strategy:
1. Keep Redis for caching and sessions
2. Add PostgreSQL repositories parallel to Redis
3. Migrate export records to DB tables
4. Add winner history table
5. Implement audit logging
