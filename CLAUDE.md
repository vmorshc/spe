# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Quick Reference

**Development Commands**
- `pnpm dev` - Start dev server with Turbopack
- `pnpm build` - Build for production
- `pnpm check:fix` - Fix all linting + formatting issues
- `pnpm type-check` - Run TypeScript checks

**Key Documentation**
- `docs/base.md` - Project overview, tech stack, user flows
- `docs/architecture.md` - System architecture, patterns, data flows
- `docs/config.md` - Environment variables and configuration
- `docs/data-models.md` - Redis schemas, data models, lifecycles
- `docs/api.md` - Server Actions and route handlers reference
- `docs/ui.md` - Component architecture and design patterns

**Domain-Specific Docs**
- `docs/facebook.md` - Facebook Graph API integration
- `docs/redis/redis.md` - Redis client and repositories
- `docs/feature-flags.md` - Feature flags system
- `docs/instagram-export.md` - Comment export flow
- `docs/actions/` - Individual server action documentation
- `docs/pages/` - Page-specific implementation details

## Project Overview

Pickly (SPE) is a Ukrainian-language web app for transparent Instagram giveaways. Users authenticate with Instagram Business accounts, select posts, export comments, and pick winners using cryptographically secure randomization.

**Core Flow**: OAuth → Select Profile → Browse Posts → View Comments → Export/Pick Winner

**Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind v4, Redis, Iron Session, Facebook Graph API

## Working with This Codebase

### Code Style & Quality
- **Biome** for linting + formatting (replaces ESLint/Prettier)
- **TypeScript** strict mode, 100-char line width, single quotes, trailing commas ES5
- Pre-commit hooks run type-check, lint, and format
- Import organization is automatic

### Adding Features
1. Check `docs/base.md` for user flows and existing features
2. Review `docs/architecture.md` for patterns (Repository, Server Actions)
3. Check `docs/actions/` for related server actions
4. Add server action in `src/lib/actions/` (see `docs/api.md`)
5. Create UI components in `src/components/` (see `docs/ui.md`)
6. Use `AppHeader` for authenticated pages, `Section` for landing sections
7. Test Redis graceful degradation

### Working with Instagram Data
- All Instagram API calls go through `src/lib/facebook/client.ts` (see `docs/facebook.md`)
- Server actions in `src/lib/actions/instagram.ts` handle caching (see `docs/actions/instagram.md`)
- Cache TTL: 5 minutes for profiles/posts
- Export flow is async with progress tracking (see `docs/instagram-export.md`)

### Working with Sessions
- Iron Session stores only session ID in cookie (AES-256-GCM)
- Full session data lives in Redis with 24h TTL
- Use `getCurrentUser()` from `src/lib/actions/auth.ts` (see `docs/actions/auth.md`)
- Feature flags stored in session cookie (see `docs/feature-flags.md`)

### UI Development
- Use shadcn/ui components from `src/components/ui/` (lowercase paths)
- Tailwind v4 with CSS variables in `src/app/globals.css`
- Framer Motion for animations (keep subtle and fast)
- Virtualize long lists with `react-window`
- See `docs/ui.md` for component patterns and examples

### Configuration
- Client config: `src/config/client.ts` (NEXT_PUBLIC_* only)
- Server config: `src/config/server.ts` (secrets, validated with Zod)
- Shared constants: `src/config/shared.ts`
- See `docs/config.md` for full environment variable reference

### Data Models
- User sessions, temp OAuth data, Instagram cache, export records
- All Redis key patterns documented in `docs/data-models.md`
- Repository pattern for all Redis access (see `docs/redis/redis.md`)

## Common Tasks

### Adding a New Server Action
1. Create/update file in `src/lib/actions/`
2. Mark function with `'use server'`
3. Handle authentication with `getCurrentUser()` if needed
4. Use repository pattern for Redis access
5. Return typed data, handle errors gracefully
6. Document in `docs/actions/`

### Adding a New Page
1. Create route in `src/app/` using App Router
2. Use Server Components for data fetching
3. Call server actions directly (no API routes)
4. Document in `docs/pages/`
5. Add to navigation if needed

### Adding a New Redis Repository
1. Extend `BaseRedisRepository` in `src/lib/redis/repositories/`
2. Define key prefix and TTL constants
3. Guard against `this.client` being `null`
4. Use `this.getKey()` for namespaced keys
5. Return safe defaults on errors
6. Document in `docs/redis/redis.md`

### Debugging OAuth Flow
1. Check `docs/oauth-implementation-context.md` for flow details
2. OAuth callback handler: `src/app/auth/callback/route.ts`
3. State validation uses constant-time comparison
4. Temp data stored in Redis for 5 minutes
5. Profile selection in `src/app/auth/select-profile/page.tsx`

### Testing Locally
- Requires Facebook App configured with OAuth redirect
- Redis optional but recommended (use Docker: `docker run -p 6379:6379 redis`)
- Copy `.env.example` to `.env.local` and fill in values
- Run `pnpm dev` and visit `http://localhost:3001`

## Security Considerations

**Always**:
- Keep access tokens in Redis, never expose to client
- Validate OAuth state with constant-time comparison
- Use Zod schemas for runtime validation
- Set proper TTLs on sensitive Redis keys
- Use Iron Session for cookies (httpOnly, sameSite: 'lax')

**Never**:
- Import `serverConfig` in client components
- Log access tokens or session IDs
- Expose Facebook API errors directly to users
- Store sensitive data in local storage or unencrypted cookies

## References

**Full Documentation**: See `docs/` directory for comprehensive guides
**Server Actions**: `docs/api.md` + `docs/actions/` for each action
**Pages**: `docs/pages/` for page-specific implementation details
**Architecture**: `docs/architecture.md` for system design and patterns