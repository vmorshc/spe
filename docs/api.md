**Overview**
This project avoids traditional HTTP APIs. Data mutations and queries are done through Next.js Server Actions in `src/lib/actions` and called directly from components.

**Primary Data Interfaces (Server Actions)**
- `src/lib/actions/auth.ts` (OAuth login, session, user state).
- `src/lib/actions/instagram.ts` (profile, posts, comments, refresh, access checks).
- `src/lib/actions/instagramExport.ts` (comment export jobs, export status, CSV prep).
- `src/lib/actions/featureFlags.ts` (session-scoped flags).
- `src/lib/actions/counters.ts` (landing visit counter).
- `src/lib/actions/newsletter.ts` (waitlist signup).

**Route Handlers (Minimal HTTP Endpoints)**
- `GET /auth/callback` in `src/app/auth/callback/route.ts`.
  - Handles Facebook OAuth callback, validates state, exchanges tokens, redirects to `/auth/select-profile` or `/auth/error`.
- `GET /ig` in `src/app/ig/route.ts`.
  - Redirects to home with UTM parameters (Instagram bio link).
- `GET /api/exports/[exportId]/csv` in `src/app/api/exports/[exportId]/csv/route.ts`.
  - Authenticated CSV download for a completed export.

**Notes**
- UI pages call Server Actions directly; no public REST API is intended.
- Route handlers are internal and tied to session auth and Redis records.
