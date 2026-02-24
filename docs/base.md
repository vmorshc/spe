**Project Summary**
Pickly (SPE) is a Ukrainian-language web app for transparent Instagram giveaways. The product flow is: Instagram OAuth -> choose business profile -> pick a post -> load comments -> export or (future) pick a winner.

**Key User Flows**
- Authenticate with Instagram Business/Creator account (OAuth).
- Browse Instagram posts and open a post details view.
- View latest comments and run an export to fetch full comment history.
- Manage feature flags for the current session (internal/system page).
- Read legal/privacy/contact pages and join the waitlist.

**Tech Stack**
- Next.js 15 App Router with React 19 and TypeScript (strict).
- Tailwind CSS v4 for styling, Framer Motion for animations.
- Redis (ioredis) for sessions, caching, and export storage.
- Iron Session for secure cookies and session IDs.
- Zod for environment validation.

**Major Libraries**
- `next`, `react`, `react-dom`, `typescript`.
- `tailwindcss`, `@tailwindcss/postcss`.
- `framer-motion`, `lucide-react`, `react-icons`.
- `react-hook-form` (waitlist form), `react-window` (comment virtualization), `react-intersection-observer` (infinite scroll).
- `date-fns` for date formatting.
- `papaparse` (CSV utilities).

**Integrations**
- Facebook/Instagram Graph API for OAuth, profile, posts, comments.
- MailerLite for waitlist/newsletter signup.
- Google Analytics via `@next/third-parties`.

**Runtime Architecture**
- Server Actions are the primary data API layer in `src/lib/actions`.
- Route Handlers are used only for OAuth callback, CSV download, and short redirects.
- Redis repositories in `src/lib/redis/repositories` implement caching and export storage.
- Feature flags live in session and are toggled via server actions.

**Config & Environment**
- Client config: `src/config/client.ts` (NEXT_PUBLIC_* only).
- Server config: `src/config/server.ts` (secrets).
- Shared constants: `src/config/shared.ts`.
- Typical env vars: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `SESSION_SECRET`, `REDIS_URL`, `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_NODE_ENV`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`.

**Repo Layout (High Level)**
- `src/app` routes, layouts, and route handlers.
- `src/components` UI and feature components (landing, auth, instagram, system).
- `src/lib` server actions, auth, feature flags, Redis, integrations.
- `docs` project documentation.

**Notes / Status**
- Winner selection UI exists, but the current action shows a placeholder alert.
- Reels tab and filters are visible but marked "coming soon".
