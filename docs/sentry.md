# Sentry

Error tracking, performance monitoring, and session replay via `@sentry/nextjs`.

**Dashboard**: [pickly-mv.sentry.io](https://pickly-mv.sentry.io)

## Configuration Files

| File | Purpose |
|---|---|
| `src/instrumentation-client.ts` | Client-side init (browser) — includes Replay |
| `sentry.server.config.ts` | Server-side init (Node.js) |
| `sentry.edge.config.ts` | Edge runtime init (middleware) |
| `src/instrumentation.ts` | Loads server/edge configs via `register()` |
| `src/app/global-error.tsx` | Catches unhandled errors, reports to Sentry |
| `next.config.ts` | `withSentryConfig()` wrapper — source maps, tunnel |

## What's Enabled

- **Error tracking** — client, server, and edge errors are captured automatically
- **Performance tracing** — `tracesSampleRate: 1` (100% of transactions)
- **Session Replay** — records user sessions with full visibility:
  - `replaysSessionSampleRate: 0.1` (10% of normal sessions)
  - `replaysOnErrorSampleRate: 1.0` (100% when error occurs)
  - No masking: `maskAllText: false`, `maskAllInputs: false`, `blockAllMedia: false`
- **Logs** — `enableLogs: true` on all runtimes
- **PII** — `sendDefaultPii: true` on all runtimes
- **Tunnel** — `/monitoring` route proxies Sentry requests to bypass ad-blockers
- **Source maps** — uploaded on build (`widenClientFileUpload: true`)
- **Router transitions** — captured via `onRouterTransitionStart`
- **Request errors** — captured via `onRequestError`
