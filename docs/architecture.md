# Architecture

## Overview
Pickly uses Next.js 15 App Router with React Server Components and Server Actions as the primary data layer. Authentication is handled via Facebook OAuth for Instagram Business accounts, with sessions stored in Redis.

## Architecture Patterns

### Repository Pattern
Data access is abstracted through repository classes in `src/lib/redis/repositories/`. Each repository extends `BaseRedisRepository` and handles caching, TTL management, and graceful degradation.

### Server Actions as API Layer
All data mutations and queries are implemented as Next.js Server Actions in `src/lib/actions/`. This eliminates the need for REST API endpoints and keeps all data fetching server-side.

### Singleton Pattern
Redis client (`src/lib/redis/client.ts`) uses singleton pattern with connection resilience and automatic reconnection handling.

### Configuration Factory
Three-tier configuration system (`src/config/`):
- `shared.ts` - Hardcoded constants (client-safe)
- `client.ts` - `NEXT_PUBLIC_*` variables only
- `server.ts` - Server-only secrets with Zod validation

### Session Management
Iron Session provides AES-256-GCM encrypted cookies storing only session IDs. Full session data lives in Redis with 24-hour TTL. This enables:
- Stateless horizontal scaling
- Secure token storage
- Fast session invalidation

## Project Structure

```
src/
├── app/                           # Next.js 15 App Router
│   ├── api/                       # Minimal route handlers
│   │   └── exports/[id]/csv/      # CSV download endpoint
│   ├── auth/                      # OAuth flow pages
│   │   ├── callback/route.ts      # Facebook OAuth callback
│   │   ├── error/page.tsx         # OAuth error page
│   │   └── select-profile/        # Instagram account selection
│   ├── app/instagram/             # Authenticated Instagram UI
│   │   ├── posts/                 # Posts grid with infinite scroll
│   │   └── posts/[postId]/        # Post details + comments
│   ├── app/giveaway/[postId]/     # Giveaway wizard
│   ├── legal/                     # Terms, privacy, contact
│   ├── system/flags/              # Feature flags admin
│   ├── layout.tsx                 # Root layout + metadata
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Tailwind v4 + CSS variables
│
├── components/
│   ├── ui/                        # shadcn/ui + custom primitives
│   ├── landing/                   # Landing page sections
│   ├── auth/                      # Login/logout components
│   ├── instagram/                 # Posts, comments, export UI
│   ├── giveaway/                  # Wizard flow + winner selection
│   └── system/                    # Feature flags UI
│
├── lib/
│   ├── actions/                   # Server Actions (primary API)
│   │   ├── auth.ts                # OAuth, session management
│   │   ├── instagram.ts           # Profile, posts, comments
│   │   ├── instagramExport.ts     # Comment export jobs
│   │   ├── giveaway.ts            # Winner selection logic
│   │   ├── featureFlags.ts        # Session-scoped flags
│   │   ├── counters.ts            # Visit counter
│   │   └── newsletter.ts          # Waitlist signup
│   ├── auth/                      # Session + OAuth utilities
│   ├── contexts/                  # React contexts (Auth, Wizard)
│   ├── facebook/                  # Facebook Graph API client
│   ├── redis/                     # Redis client + repositories
│   ├── instagramExport/           # Export types + utilities
│   ├── giveaway/                  # Winner selection logic
│   └── types/                     # Shared TypeScript types
│
├── config/
│   ├── shared.ts                  # Hardcoded constants
│   ├── client.ts                  # Client-safe env vars
│   ├── server.ts                  # Server-only secrets
│   └── index.ts                   # Unified exports
│
└── design-system/                 # Future design tokens
```

## Data Flow

### Authentication Flow
1. User clicks "Login with Instagram"
2. `initiateOAuthLogin()` generates state token → stores in Redis → redirects to Facebook
3. Facebook redirects to `/auth/callback` with code
4. Callback validates state, exchanges code for token, fetches Instagram accounts
5. User selects account on `/auth/select-profile`
6. `selectInstagramProfile()` creates session in Redis, stores session ID in cookie
7. User redirected to `/app/instagram/posts`

### Comment Export Flow
1. User clicks "Export Comments" on post details page
2. `startExportAction()` creates export record with `pending` status
3. `resumeExportAction()` runs in background, fetching comments in batches
4. Progress updates are stored in Redis, UI polls via `getExportAction()`
5. When complete, status changes to `done` and CSV becomes available
6. User downloads via `/api/exports/[exportId]/csv`

### Giveaway Wizard Flow
1. User initiates wizard from post details
2. Wizard loads post metadata and recent comments
3. Step 1: Review post, Step 2: Configure filters
4. Step 3: Generate random seed client-side, hash server-side
5. Step 4: Display winner with confetti + audit trail

## Security Architecture

### CSRF Protection
OAuth state parameters are cryptographically random (32 bytes) with constant-time validation to prevent timing attacks.

### Session Security
- Iron Session with AES-256-GCM encryption
- 7-day expiration on cookies
- httpOnly, sameSite: 'lax', secure in production
- Only session ID in cookie, full data in Redis

### Token Security
- Access tokens stored server-side in Redis only
- No token exposure to client
- Long-lived tokens (60 days) refreshed automatically

### Redirect Validation
All OAuth redirects validated against domain whitelist to prevent open redirect vulnerabilities.

## Scalability Design

### Stateless Application
- No in-memory session storage
- All state in Redis
- Enables horizontal scaling without sticky sessions

### Caching Strategy
- Profile cache: 5 minutes
- Posts cache: 5 minutes
- Sessions: 24 hours
- Export records: 7 days
- Comment lists: 3 days

### Database Preparation
Infrastructure ready for PostgreSQL/MySQL integration. Current Redis usage is designed for easy migration to relational storage.

## Performance Optimizations

### Image Optimization
- Next.js Image component with automatic WebP/AVIF
- Facebook/Instagram CDN integration
- Responsive images with srcset

### Data Fetching
- Server Actions eliminate client-to-server roundtrips
- Cursor-based pagination for infinite scroll
- Optimistic updates for immediate UI feedback

### Comment Virtualization
- `react-window` for long comment lists
- Renders only visible rows
- Handles 5,000+ comments smoothly

### Font Optimization
- Preloaded Geist Sans/Mono fonts
- CSS variables for consistent typography
- No FOUT (Flash of Unstyled Text)
