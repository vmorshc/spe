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
    uniqUsers: number;         // Approximate unique commenters (HyperLogLog)
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
- `igexp:{exportId}:hll:users` - TTL 3d - HyperLogLog of unique user IDs
- `igexp:index:media:{mediaId}` - TTL 14d - Set of export IDs for media
- `igexp:index:user:{instagramId}` - TTL 14d - Set of export IDs for user

### Giveaway Records
- `giveaway:{giveawayId}` - TTL 30d - Full GiveawayRecord (JSON)
- `giveaway:index:post:{mediaId}` - TTL 30d - Sorted set of giveawayIds by createdAt epoch
- `giveaway:index:profile:{instagramId}` - TTL 30d - Sorted set of giveawayIds by createdAt epoch

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

Source: `src/lib/giveaway/types.ts`

### GiveawayRecord
Full draw record persisted in Redis after each giveaway. Contains all data needed for independent public verification of the result.

```typescript
interface GiveawayRecord {
  giveawayId: string;          // UUID v4
  createdAt: string;           // ISO timestamp — draw time

  exportId: string;            // Source export
  profileId: string;           // Owner instagramId

  post: {
    mediaId: string;
    postDateIso: string;       // Post publication date — part of the deterministic seed
    permalink?: string;
    caption?: string;
  };

  commentCount: number;        // commentsCountAtStart or list.length — part of seed

  participantsHash: string;    // SHA-256 of newline-joined commentIds (filtered, sorted asc)
  filteredParticipantCount: number; // Participant count after unique-users filter

  options: {
    uniqueUsers: boolean;      // Only first comment per userId participates
    uniqueWinners: boolean;    // Each userId can win at most once
    winnerCount: number;
  };

  winners: GiveawayWinner[];   // All draw attempts — active and deprecated
}
```

**Storage**: Redis `giveaway:{giveawayId}` with 30d TTL
**Indexes**:
- `giveaway:index:post:{mediaId}` — sorted set, score = createdAt epoch, 30d TTL
- `giveaway:index:profile:{instagramId}` — sorted set, score = createdAt epoch, 30d TTL

**Usage**: Giveaway audit trail, winner display, public seed verification

### GiveawayWinner
One draw attempt for one winner slot. Multiple entries exist for the same `winnerNumber` when a re-draw is forced by `uniqueWinners`; only the last attempt has `status === 'active'`.

```typescript
type GiveawayWinnerStatus = 'active' | 'deprecated';

interface GiveawayWinner {
  winnerNumber: number;        // 1-based slot (1 = first place, 2 = second, ...)
  attempt: number;             // 1 = first draw, incremented on each re-draw
  status: GiveawayWinnerStatus; // 'active' = this is the accepted winner; 'deprecated' = superseded
  seedInput: string;           // Canonical seed string: postId|postDateIso|commentCount|giveawayDateIso|participantsHash|winnerNumber|attempt
  seedHash: string;            // SHA-256 hex of seedInput — used as 32-byte ChaCha20 key
  winnerIndex: number;         // Index in the filtered, sorted participants list
  participant: {
    commentId: string;
    userId: string;
    username: string;
  };
}
```

### GiveawayListItem
Lightweight summary for list views.

```typescript
interface GiveawayListItem {
  giveawayId: string;
  createdAt: string;
  post: { mediaId: string; permalink?: string };
  options: { winnerCount: number };
  activeWinnerCount: number;   // Winners with status === 'active'
}
```

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

### Giveaway Lifecycle
1. User completes export (status `done`) and triggers draw from wizard Step 3
2. `runGiveawayAction()` loads comments, runs `GiveawayEngine`, persists `GiveawayRecord`
3. Winners returned as `NormalizedComment[]` to display in Step 4
4. Record retrievable at any time via `getGiveawayAction(giveawayId)` for audit
5. Record expires after 30 days

### Cache Lifecycle
- Instagram profile/posts cache expires after 5 minutes
- Can be manually invalidated via `refreshInstagramData()`
- Gracefully handles Redis unavailability by fetching fresh data

## Migration Notes

**Current State**: Redis-only storage with TTL-based expiration
**Future State**: PostgreSQL for persistent data (exports, giveaway records, analytics)

Migration strategy:
1. Keep Redis for caching and sessions
2. Add PostgreSQL repositories parallel to Redis
3. Migrate export records to DB tables
4. Migrate giveaway records to DB (permanent audit trail, no TTL expiry)
5. Implement audit logging
