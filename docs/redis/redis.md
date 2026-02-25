# Redis Integration

Sources: `src/lib/redis/README.md`, `src/lib/redis/client.ts`, `src/lib/redis/repositories/*`.

## How It Works

- `redisClient` is a singleton `ioredis` client created from `serverConfig.REDIS_URL`.
- If Redis is not configured or unavailable, repositories return safe defaults and do not block UI.
- `BaseRedisRepository` provides key prefixing and common helpers like `ping()` and `delete()`.

## How To Build A Repository

1. Extend `BaseRedisRepository` and pass a key prefix in `super('prefix')`.
2. Guard against `this.client` being `null`.
3. Use `this.getKey()` to build namespaced keys.
4. Set TTLs where appropriate and return safe defaults on errors.

## Repositories And Keys

`CountersRepository` (`counter:*`)
- Methods: `get`, `increment`, `set`, `reset`, `has`, `remove`.
- Used for landing page visit counts.

`InstagramRepository` (`instagram:*`)
- Caches profile, posts (with cursors), post details, and recent comments.
- TTL: 300 seconds for cached items.

`UserRepository` (`user:*`)
- Sessions: `user:session:{id}` with 24h TTL.
- Temp OAuth data: `user:temp:{id}` with 5m TTL.

`InstagramExportRepository` (`igexp:*`)
- Export record: `igexp:{exportId}` with 7d TTL.
- Comment list: `igexp:{exportId}:comments` with 3d TTL.
- Dedupe sets: `igexp:{exportId}:dedupe:*` with 3d TTL.
- Indexes: `igexp:index:media:{mediaId}` and `igexp:index:user:{instagramId}` with 14d TTL.

`GiveawayRepository` (`giveaway:*`)
- Giveaway record: `giveaway:{giveawayId}` with 30d TTL.
- Methods: `createGiveaway`, `getGiveaway`, `listByPost`, `listByProfile`.
- Indexes: `giveaway:index:post:{mediaId}` and `giveaway:index:profile:{instagramId}` — sorted sets scored by `createdAt` epoch, 30d TTL.

`NewsletterRateLimiter` (`newsletter_rate_limit:*`)
- Sliding window limiter for newsletter subscriptions.

## Where Repositories Are Used

- `CountersRepository` in `src/lib/actions/counters.ts`.
- `InstagramRepository` in `src/lib/actions/instagram.ts`.
- `UserRepository` in `src/lib/actions/auth.ts` and OAuth flow.
- `InstagramExportRepository` in `src/lib/actions/instagramExport.ts`.
- `GiveawayRepository` in `src/lib/actions/giveaway.ts`.
- `NewsletterRateLimiter` in `src/lib/actions/newsletter.ts`.
