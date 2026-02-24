# Giveaway Actions

Source: `src/lib/actions/giveaway.ts`

Purpose: Server action for selecting random giveaway winners using cryptographically secure randomness and Fisher-Yates shuffle algorithm.

## Methods

### `pickWinnersAction(exportId, count)`

**Signature**
```typescript
pickWinnersAction(exportId: string, count: number): Promise<NormalizedComment[]>
```

**Parameters**
- `exportId`: The export ID to select winners from
- `count`: Number of winners to select (1 to total participants)

**Returns**
`Promise<NormalizedComment[]>` - Array of randomly selected winner comments

**How it works**
1. **Authentication**: Verifies user is logged in via `getCurrentUser()`
2. **Export Validation**:
   - Loads export record from Redis
   - Verifies ownership (user must own the export)
   - Checks export status is `done`
3. **Input Validation**: Ensures `count` is between 1 and total participants
4. **Data Loading**: Fetches all comments via `getCommentsSlice(exportId, 0, total)`
5. **Shuffling**: Applies Fisher-Yates shuffle with crypto.getRandomValues
6. **Selection**: Returns first `count` items from shuffled array

**Error Handling**
- `Unauthorized`: User not logged in
- `Export not found`: Invalid exportId
- `Forbidden`: User doesn't own the export
- `Export is not complete`: Status is not `done`
- `Winner count must be between...`: Invalid count

## Algorithm: Fisher-Yates Shuffle

### Implementation
```typescript
function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

### Why Fisher-Yates?
- **Unbiased**: Every permutation has equal probability
- **Efficient**: O(n) time complexity, O(n) space
- **Standard**: Well-known, auditable algorithm

### Cryptographic Randomness
- Uses `crypto.getRandomValues(new Uint32Array(1))` instead of `Math.random()`
- Provides cryptographically secure pseudorandom numbers
- Ensures fairness and prevents prediction/manipulation

## Security Considerations

### Ownership Protection
- Export ownership verified via `exportRecord.owner.instagramId`
- Users cannot select winners from other users' exports

### Status Validation
- Only completed exports (`status === 'done'`) can be used
- Prevents picking winners from incomplete data

### Input Sanitization
- Winner count bounded by total participants
- Prevents out-of-bounds access

## Performance

### Data Handling
- Loads full comment list into memory (max 5000 comments per export)
- Single Redis read via `getCommentsSlice`
- Shuffle performed in-memory

### Scalability
- Current limit: 5000 comments (hard cap in export flow)
- For larger datasets, consider streaming or chunked processing

## Integration

### Used By
- `Step3GiveawaySettings.tsx`: Calls when "Start Giveaway" clicked
- `GiveawayWizardClient.tsx`: Passes winners to Step 4

### Data Flow
1. User configures winner count in Step 3
2. Client calls `pickWinnersAction(exportId, count)`
3. Server validates, shuffles, returns winners
4. Client displays results in Step 4 with animations

## Testing Notes

- Randomness quality verified via statistical tests
- Fairness guaranteed by Fisher-Yates correctness proof
- All edge cases handled (count=1, count=total, ownership)
