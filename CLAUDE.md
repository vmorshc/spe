# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server with Turbopack (preferred)
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter for code quality checks
- `pnpm lint:fix` - Auto-fix linting issues
- `pnpm format` - Check code formatting with Biome
- `pnpm format:fix` - Auto-fix formatting issues
- `pnpm check` - Run all Biome checks (lint + format)
- `pnpm check:fix` - Auto-fix all Biome issues
- `pnpm type-check` - Run TypeScript type checking

## Project Overview

Sure Pick Engine (SPE) is a Ukrainian-language web application for conducting transparent and fair Instagram giveaways. The application enables business account owners to automatically select random winners from Instagram post comments using a cryptographically secure process.

### Core Business Logic
1. **Instagram Authentication** - Secure OAuth flow for Instagram Business accounts
2. **Post Selection** - Browse and select Instagram posts for giveaways
3. **Comment Import** - Fetch up to 5,000 comments from selected posts
4. **Random Winner Selection** - Cryptographically secure random selection
5. **Transparent Results** - Display selection process and auditable results

## Tech Stack & Configuration

### Core Framework
- **Next.js 15** with App Router architecture
- **TypeScript** with strict mode and bundler module resolution
- **React 19** with modern hooks and patterns
- **Turbopack** for fast development builds (via `--turbopack` flag)

### Code Quality & Formatting
- **Biome** replaces ESLint/Prettier with unified linting and formatting
- **Husky** with lint-staged for pre-commit hooks
- **TypeScript** strict mode with `noEmit` type checking
- 100-character line width, single quotes, trailing commas ES5 style
- Automatic import organization and complexity checks

### Authentication & Session Management
- **Iron Session** for secure cookie-based sessions (AES-256-GCM encryption)
- **Facebook Graph API** OAuth integration for Instagram Business accounts
- **Redis** for session storage and caching (with ioredis client)
- **Zod** for runtime type validation and environment variable validation

### Data Layer
- **Redis** singleton client with connection resilience and graceful degradation
- **Repository pattern** for data access abstraction
- **Caching strategy**: 5min for API data, 24hr for sessions, persistent counters

### Styling & UI
- **Tailwind CSS v4** with new `@theme inline` syntax and PostCSS configuration
- **Framer Motion** for animations and interactions
- **Lucide React** + **React Icons** for iconography
- **Geist Sans/Mono** fonts from Google Fonts with CSS variables

## Architecture

### Project Structure
```
src/
├── app/
│   ├── api/counters/landing-visits/   # Analytics API
│   ├── auth/
│   │   ├── callback/route.ts          # OAuth callback handler
│   │   ├── error/page.tsx             # OAuth error page
│   │   └── select-profile/page.tsx    # Instagram account selection
│   ├── instagram/posts/               # Instagram posts browsing
│   ├── layout.tsx                     # Root layout with metadata
│   ├── page.tsx                       # Landing page
│   └── globals.css                    # Global styles with Tailwind v4
├── components/
│   ├── ui/                           # Reusable UI primitives
│   ├── landing/                      # Landing page sections
│   ├── auth/                         # Authentication components
│   └── instagram/                    # Instagram-specific components
├── lib/
│   ├── actions/                      # Next.js Server Actions
│   ├── auth/                         # Session and OAuth utilities
│   ├── contexts/                     # React contexts
│   ├── facebook/                     # Facebook Graph API client
│   ├── redis/                        # Redis client and repositories
│   ├── types/                        # TypeScript type definitions
│   └── env.ts                        # Environment validation
├── config/
│   ├── shared.ts                     # Hardcoded constants (client-safe)
│   ├── client.ts                     # Client-safe environment variables
│   ├── server.ts                     # Server-only secrets
│   └── index.ts                      # Configuration exports
└── design-system/                    # Future design system structure
```

### Configuration System
Uses a three-tier configuration approach:
- **Shared Config** (`shared.ts`) - Hardcoded constants safe for client/server
- **Client Config** (`client.ts`) - NEXT_PUBLIC_ environment variables only
- **Server Config** (`server.ts`) - Server-only secrets with Zod validation

### Authentication Flow
1. **OAuth Initiation** - Generate secure state parameter → redirect to Facebook OAuth
2. **Callback Processing** - Validate state → exchange code for token → fetch Instagram accounts
3. **Token Management** - Exchange short-lived for long-lived tokens (60 days)
4. **Profile Selection** - User selects Instagram Business account → create session
5. **Session Storage** - Store session in Redis, only session ID in encrypted cookie

### Security Features
- **CSRF Protection** - Cryptographically secure state parameters with constant-time validation
- **Session Security** - Iron Session with 7-day expiration, httpOnly, sameSite: 'lax'
- **Redirect Validation** - Strict URL validation preventing open redirect attacks
- **Token Security** - Server-side token storage, minimal client-side exposure

## Data Models & Redis Schema

### User Session Model
```typescript
interface UserSession {
  sessionId: string;
  instagramId: string;
  username: string;
  profilePicture: string;
  followersCount: number;
  mediaCount: number;
  accessToken: string;        // Long-lived Facebook token
  pageId: string;
  pageName: string;
  createdAt: string;
  expiresAt: string;          // 24-hour expiration
}
```

### Redis Key Patterns
- **Sessions**: `user:session:{sessionId}` (TTL: 24 hours)
- **Temp Data**: `user:temp:{tempId}` (TTL: 5 minutes)
- **Instagram Cache**: `instagram:profile:{userId}` (TTL: 5 minutes)
- **Posts Cache**: `instagram:posts:{userId}:{cursor}` (TTL: 5 minutes)
- **Counters**: `counter:{counterName}` (persistent)

## Facebook/Instagram API Integration

### Required OAuth Scopes
- `pages_show_list` - Access to Facebook pages
- `business_management` - Business account management
- `instagram_basic` - Basic Instagram access
- `instagram_manage_comments` - Comment access for giveaways
- `pages_read_engagement` - Read page engagement data
- `public_profile` - Basic profile information

### API Endpoints Used
- **OAuth Flow**: Facebook v22.0 OAuth dialog and token exchange
- **Pages Discovery**: `/me/accounts` with Instagram business accounts
- **Profile Details**: `/{instagram-id}` with comprehensive fields
- **Posts Fetching**: `/{instagram-id}/media` with cursor-based pagination

### Error Handling
- Comprehensive Facebook API error response handling
- Graceful degradation when Redis unavailable
- User-friendly error messages without exposing internals

## Environment Variables

### Required Configuration
```bash
# Facebook OAuth (Required)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Session Security (Required)
SESSION_SECRET=32_character_minimum_secret

# Redis (Optional - app functions without it)
REDIS_URL=redis://localhost:6379

# Public Configuration (Required)
NEXT_PUBLIC_DOMAIN=https://yourdomain.com
NEXT_PUBLIC_NODE_ENV=production
```

### Validation System
- **Zod schemas** for type-safe environment validation
- **Startup validation** - Fails fast with detailed error messages
- **Dual validation** - Separate client/server environment validation

## Component Architecture

### Landing Page Components (`/components/landing/`)
- **Header** - Navigation with login/logout functionality and user profile
- **Hero** - Main CTA with real-time visit counter display
- **HowItWorks** - Three-step process explanation with animated cards
- **Benefits** - Security and transparency feature highlights
- **FuturePlans** - Upcoming features roadmap (filtering, analytics, notifications)
- **FAQ** - Frequently asked questions about the service
- **Footer** - Contact information and social links

### Instagram Components (`/components/instagram/`)
- **InstagramHeader** - Authenticated user navigation
- **ProfileHeader** - User profile display with follower counts
- **PostCard** - Individual post component with engagement metrics
- **PostsGrid** - Infinite scrolling grid with cursor-based pagination

### Authentication Components (`/components/auth/`)
- **LoginButton** - OAuth login initiation with Instagram branding
- **UserProfile** - User information display and logout functionality

### UI Components (`/components/ui/`)
- **Button** - Reusable button with variants (primary, secondary, outline, ghost)
- **Section** - Layout wrapper with background variants and consistent spacing

## State Management

### Client-Side State
- **AuthContext** - Global authentication state with React Context
- **Custom Hook** - `useAuth()` with proper error boundaries and loading states
- **Component State** - Local UI state with `useState` for interactions

### Server-Side State
- **Redis Sessions** - User authentication and profile data
- **Redis Caching** - Instagram API response caching with TTL
- **Server Actions** - Next.js 15 Server Actions for data fetching and mutations

## Performance Optimizations

### Caching Strategy
- **Redis Layer**: Profile cache (5min), posts cache (5min), sessions (24hr)
- **Static Optimization**: Next.js automatic static optimization
- **Image Optimization**: Next.js Image component with Facebook/Instagram CDN
- **Font Optimization**: Preloaded Geist fonts with CSS variables

### Data Fetching Patterns
- **Server Actions**: Direct server-to-server API calls (no client API exposure)
- **Infinite Scroll**: Cursor-based pagination for Instagram posts
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Error Boundaries**: Graceful degradation for failed operations

## Development Patterns

### Code Quality
- **Biome Configuration**: Modern ESLint/Prettier replacement
- **Pre-commit Hooks**: TypeScript checking, formatting, and linting
- **Type Safety**: Comprehensive TypeScript with strict mode
- **Error Handling**: Structured error handling with fallbacks

### Security Patterns
- **Constant-time Comparison**: Prevents timing attacks on state validation
- **Input Validation**: Zod schemas for runtime validation
- **Secure Headers**: Next.js security headers configuration
- **No Client Secrets**: All sensitive data server-side only

### Architecture Patterns
- **Repository Pattern**: Clean data access abstraction
- **Singleton Pattern**: Redis client with connection management
- **Factory Pattern**: Configuration builders for different environments
- **Observer Pattern**: Event-driven Redis connection handling

## Scalability Considerations

### Infrastructure Ready
- **Stateless Design**: Sessions in Redis, not server memory
- **Horizontal Scaling**: No server-side state dependencies
- **CDN Integration**: Static assets optimized for CDN delivery
- **Database Preparation**: Infrastructure ready for database integration

### Monitoring Ready
- **Structured Logging**: Consistent logging patterns throughout
- **Health Checks**: Redis availability monitoring
- **Error Tracking**: Comprehensive error boundaries and handling
- **Analytics**: Visit tracking and metrics collection infrastructure

## Production Deployment

### Build Configuration
- **Next.js**: ESLint disabled during builds for faster CI/CD
- **TypeScript**: ES2017 target for broad browser compatibility
- **Images**: Remote patterns configured for Facebook/Instagram CDNs
- **Security**: Secure cookie configuration for production

### Environment Setup
- **Redis Clustering**: ioredis supports Redis Cluster out of the box
- **SSL/TLS**: Redis client configured for secure connections
- **Graceful Degradation**: Application functions without Redis (with limitations)
- **Error Handling**: No sensitive information in client-facing errors

## Future Enhancements

### Planned Features
- Advanced comment filtering and validation
- Multi-post giveaway support
- Detailed analytics and reporting
- Winner history tracking and management
- Automated winner notification system
- Instagram Reels and Stories support

### Technical Improvements
- Automated testing setup (currently not implemented)
- API documentation with OpenAPI/Swagger
- Enhanced error monitoring and alerting
- Performance monitoring and optimization
- Database integration for persistent data storage