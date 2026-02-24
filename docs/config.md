# Configuration

Sources: `src/lib/env.ts`, `src/config/shared.ts`, `src/config/client.ts`, `src/config/server.ts`, `src/config/index.ts`.

## How It Works

1. `env.ts` defines Zod schemas for server and client environment variables.
2. `clientConfig` calls `validateClientEnv()` and exposes only `NEXT_PUBLIC_` values.
3. `serverConfig` calls `validateServerEnv()` and exposes server-only secrets and derived values.
4. `sharedConfig` contains hardcoded constants safe for client and server.

## How To Use

- Client components: import `clientConfig` and `sharedConfig` from `@/config`.
- Server-only code: import `serverConfig` from `@/config/server`.
- Do not import `serverConfig` in client components.

## Environment Variables

Server-side (validated in `validateServerEnv()`):
- `NEXT_PUBLIC_NODE_ENV`: `development` | `production` | `test`. Default `development`.
- `NEXT_PUBLIC_DOMAIN`: public domain URL. Default `http://localhost:3001`.
- `REDIS_URL`: Redis connection string. Optional.
- `FACEBOOK_APP_ID`: Facebook App ID. Required.
- `FACEBOOK_APP_SECRET`: Facebook App Secret. Required.
- `SESSION_SECRET`: iron-session secret, min 32 chars. Required.
- `MAILERLITE_API_KEY`: MailerLite API key, min 32 chars. Required.
- `MAILERLITE_GROUP_ID`: MailerLite group ID numeric string. Required.

Client-side (validated in `validateClientEnv()`):
- `NEXT_PUBLIC_NODE_ENV`: `development` | `production` | `test`. Default `development`.
- `NEXT_PUBLIC_DOMAIN`: public domain URL. Default `http://localhost:3001`.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: optional GA4 measurement ID like `G-XXXX`.

## Config Objects

`sharedConfig` (hardcoded constants):
- `SITE_NAME`.
- `FACEBOOK_REDIRECT_PATH`.
- `SUPPORT_EMAIL`, `INSTAGRAM_URL`, `FACEBOOK_PAGE_URL`.

`clientConfig` (client-safe values):
- `DOMAIN` from `NEXT_PUBLIC_DOMAIN`.
- `NODE_ENV` from `NEXT_PUBLIC_NODE_ENV`.
- `GA_MEASUREMENT_ID` from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

`serverConfig` (server-only values):
- `NODE_ENV`, `DOMAIN`, `REDIS_URL`.
- Facebook: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_REDIRECT_URI`.
- Sessions: `SESSION_SECRET`.
- MailerLite: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_ID`.

Note: `FACEBOOK_REDIRECT_URI` is derived as `${NEXT_PUBLIC_DOMAIN}${sharedConfig.FACEBOOK_REDIRECT_PATH}`.
