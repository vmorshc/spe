# Documentation Index

## Getting Started

Start here if you're new to the codebase:
1. **[base.md](./base.md)** - Project overview, tech stack, and user flows
2. **[architecture.md](./architecture.md)** - System architecture and design patterns
3. **[config.md](./config.md)** - Environment variables and configuration

## Core Systems

**Authentication & Sessions**
- [oauth-implementation-context.md](./oauth-implementation-context.md) - OAuth flow implementation details
- [actions/auth.md](./actions/auth.md) - Auth server actions reference
- [feature-flags.md](./feature-flags.md) - Session-based feature flags

**Data Layer**
- [data-models.md](./data-models.md) - Redis schemas and data models
- [redis/redis.md](./redis/redis.md) - Redis client and repositories
- [api.md](./api.md) - Server Actions overview

**Integrations**
- [facebook.md](./facebook.md) - Facebook Graph API client
- [mailerlite.md](./mailerlite.md) - Newsletter integration
- [instagram-export.md](./instagram-export.md) - Comment export system

**UI & Components**
- [ui.md](./ui.md) - Component architecture and patterns

## Server Actions Reference

All server actions documented in `actions/`:
- [auth.md](./actions/auth.md) - OAuth and session management
- [instagram.md](./actions/instagram.md) - Profile, posts, comments
- [instagramExport.md](./actions/instagramExport.md) - Comment export jobs
- [giveaway.md](./actions/giveaway.md) - Winner selection logic
- [featureFlags.md](./actions/featureFlags.md) - Feature flag mutations
- [counters.md](./actions/counters.md) - Visit counter
- [newsletter.md](./actions/newsletter.md) - Waitlist signup

## Pages Reference

Page-specific implementation details in `pages/`:
- [home.md](./pages/home.md) - Landing page
- [auth-select-profile.md](./pages/auth-select-profile.md) - Profile selection
- [auth-error.md](./pages/auth-error.md) - OAuth error handling
- [instagram-posts.md](./pages/instagram-posts.md) - Posts grid with infinite scroll
- [instagram-post-details.md](./pages/instagram-post-details.md) - Post details + comments
- [instagram-post-export.md](./pages/instagram-post-export.md) - Export management page
- [instagram-giveaway-wizard.md](./pages/instagram-giveaway-wizard.md) - Winner selection wizard
- [system-flags.md](./pages/system-flags.md) - Feature flags admin
- [legal-terms.md](./pages/legal-terms.md) - Terms of service
- [legal-privacy-policy.md](./pages/legal-privacy-policy.md) - Privacy policy
- [legal-contact.md](./pages/legal-contact.md) - Contact page

## Quick Lookup

**Common File Paths**
- Server actions: `src/lib/actions/`
- React contexts: `src/lib/contexts/`
- Redis repositories: `src/lib/redis/repositories/`
- Facebook client: `src/lib/facebook/client.ts`
- Configuration: `src/config/`
- UI components: `src/components/ui/`
- Landing components: `src/components/landing/`
- Instagram components: `src/components/instagram/`
- Auth components: `src/components/auth/`

**Key Patterns**
- Repository pattern: [redis/redis.md](./redis/redis.md)
- Server Actions as API: [api.md](./api.md)
- Session management: [actions/auth.md](./actions/auth.md)
- OAuth flow: [oauth-implementation-context.md](./oauth-implementation-context.md)
- Export jobs: [instagram-export.md](./instagram-export.md)

**Development**
- Commands: See [CLAUDE.md](../CLAUDE.md)
- Code style: Biome with 100-char lines, single quotes
- Testing: No automated tests yet (future enhancement)
