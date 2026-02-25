# Giveaway Actions

Source: `src/lib/actions/giveaway.ts`

Purpose: Server actions for running deterministic, cryptographically auditable giveaway draws and querying stored results. Built on the ChaCha20-based algorithm described in `docs/giveaway-algorithm.md`. Each draw is persisted in Redis as a `GiveawayRecord` with full seed data, enabling independent verification.

---

## Types

### `RunGiveawayResult`

Return type of `runGiveawayAction`. Contains only the fields callers need immediately.

```typescript
interface RunGiveawayResult {
  giveawayId: string;           // UUID of the stored GiveawayRecord
  winners: NormalizedComment[]; // Active winners — full comment objects
}
```

Winners are mapped from the active `GiveawayWinner` entries back to `NormalizedComment` by looking up each winner's `commentId` in the loaded comment set. All original comment fields (`text`, `timestamp`, `likeCount`, etc.) are preserved.

For the full record including seeds, hash, and deprecated entries use `getGiveawayAction`.

---

## Methods

### `runGiveawayAction(params)`

**Signature**
```typescript
runGiveawayAction(params: {
  exportId: string;
  media: InstagramMedia;
  winnerCount: number;
  uniqueUsers: boolean;
  uniqueWinners: boolean;
}): Promise<RunGiveawayResult>
```

**Parameters**
- `exportId` — ID of a completed (`status === 'done'`) export to draw from
- `media` — `InstagramMedia` object (available in wizard context); provides `id` (postId), `timestamp` (postDateIso), `permalink`, `caption`
- `winnerCount` — Number of winner slots to fill (1–N)
- `uniqueUsers` — If `true`, only the first comment per userId participates
- `uniqueWinners` — If `true`, each userId can only win once; re-draws are performed automatically

**Returns**
`Promise<RunGiveawayResult>` — Active winners as full `NormalizedComment` objects, plus the stored `giveawayId`.

**How it works**
1. **Authentication**: `getCurrentUser()` — throws `Unauthorized` if no session
2. **Export validation**: Loads record, verifies ownership, checks `status === 'done'`
3. **Comment loading**: `getCommentsSlice(exportId, 0, totalCount)` — full list into memory
4. **Engine**: Constructs `GiveawayInput`, instantiates `GiveawayEngine`, calls `run()`
5. **Persistence**: Builds `GiveawayRecord` and stores via `giveawayRepository.createGiveaway()` — also writes post and profile indexes
6. **Mapping**: Builds `commentId → NormalizedComment` map; resolves each active winner back to full comment
7. Returns `{ giveawayId, winners }`

**Error Handling**
- `Unauthorized` — no active session
- `Export not found` — invalid `exportId`
- `Forbidden: You do not own this export` — ownership mismatch
- `Export is not complete` — status is not `done`
- `Export has no comments` — empty comment list
- Engine errors: `No participants available after filtering`, `Cannot select N winners from M participants`, `Could not find unique winner for slot N after 100 attempts`

---

### `listGiveawaysAction(params, offset, limit)`

**Signature**
```typescript
listGiveawaysAction(
  params: { profileId?: string; postId?: string },
  offset?: number,
  limit?: number
): Promise<GiveawayListItem[]>
```

**Parameters**
- `params.postId` — Filter by Instagram media ID (takes priority over `profileId`)
- `params.profileId` — Filter by Instagram account ID; defaults to the authenticated user's own profile
- `offset` — Pagination offset (default `0`)
- `limit` — Page size (default `20`)

**Returns**
`Promise<GiveawayListItem[]>` — Sorted newest-first. Each item:
```typescript
interface GiveawayListItem {
  giveawayId: string;
  createdAt: string;
  post: { mediaId: string; permalink?: string };
  options: { winnerCount: number };
  activeWinnerCount: number;  // winners with status === 'active'
}
```

**How it works**
1. Authenticates via `getCurrentUser()`
2. Reads from sorted set index (`giveaway:index:post:{mediaId}` or `giveaway:index:profile:{instagramId}`) ordered by `createdAt` epoch descending
3. Fetches individual records for each ID in the page

---

### `getGiveawayAction(giveawayId)`

**Signature**
```typescript
getGiveawayAction(giveawayId: string): Promise<GiveawayRecord>
```

**Returns**
Full `GiveawayRecord` including all winners (active and deprecated), seed inputs and hashes, participants hash, and all metadata needed for independent public verification.

**How it works**
1. Authenticates, loads record, verifies `profileId === user.instagramId`
2. Returns full record as-is from Redis

**Error Handling**
- `Unauthorized`, `Giveaway not found`, `Forbidden: You do not own this giveaway`

---

## Algorithm

See `docs/giveaway-algorithm.md` for the full specification. Summary:

1. **Filtering** (if `uniqueUsers`): keep lowest `commentId` per `userId`, sort remaining by `commentId` asc
2. **Participants hash**: `SHA-256(commentId1\ncommentId2\n...)`
3. **Seed input**: `postId|postDateIso|commentCount|giveawayDateIso|participantsHash|winnerNumber|attempt`
4. **Seed hash**: `SHA-256(seedInput)` → 32-byte ChaCha20 key
5. **Selection**: `ChaCha20(key, nonce=0)` → first 8 bytes as `uint64 BE` → `index = uint64 % N`
6. **Unique winners**: if selected `userId` already won, mark entry `deprecated`, increment `attempt`, re-draw

Implementation lives in `src/lib/giveaway/engine.ts` (`GiveawayEngine` class).

---

## Security Considerations

- **Deterministic**: same `GiveawayInput` always produces identical `GiveawayResult` — anyone can reproduce the draw
- **Tamper-evident**: changing any participant, post date, or winner count changes the seed and thus the winner
- **Ownership**: export ownership verified before draw; giveaway ownership verified before read
- **No token exposure**: all operations are server-side; no Instagram tokens reach the client

---

## Integration

### Used By
- `Step3GiveawaySettings.tsx` — calls `runGiveawayAction` when user confirms the draw; passes result winners to `WizardContext.setWinners`
- `Step4Winners.tsx` — displays `NormalizedComment[]` winners from context (no direct action call)

### Data Flow
1. User configures `winnerCount`, `uniqueUsers`, `uniqueWinners` in Step 3
2. Client calls `runGiveawayAction({ exportId, media, winnerCount, ... })`
3. Server runs draw, persists `GiveawayRecord`, returns `{ giveawayId, winners }`
4. `winners` (`NormalizedComment[]`) stored in `WizardContext`
5. Step 4 displays winners with confetti animation
6. Full record retrievable at any time via `getGiveawayAction(giveawayId)` for audit

---

## Testing

Domain logic (`GiveawayEngine`) is covered by pure unit tests in `src/lib/giveaway/__tests__/engine.test.ts` — no Redis or external services required. See `src/lib/giveaway/__tests__/fixtures.ts` for reusable test data builders.
