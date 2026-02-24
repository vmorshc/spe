# Feature Flags

Sources: `src/lib/featureFlags/*`, `src/lib/actions/featureFlags.ts`, `src/lib/auth/session.ts`.

Purpose: Enable or disable features per session using iron-session storage.

## Definitions

- Flag names live in `FEATURE_FLAGS`.
- Metadata is in `FEATURE_FLAG_DEFINITIONS` with display name, description, and default value.
- Defaults are produced by `getDefaultFeatureFlags()`.

Current flags:
- `instagram_mvp` (default: `false`).

## Storage

- Feature flags are stored in the session cookie (`SessionData.featureFlags`).
- Server code updates flags via session helpers in `src/lib/auth/session.ts`.

## Server API

- `getFeatureFlags()` merges session flags with defaults.
- `getFeatureFlag(name)` reads a single flag.
- `setFeatureFlag(name, value)` and `toggleFeatureFlag(name)` mutate session state.
- `resetFeatureFlags()` resets to defaults.
- `setFeatureFlags(flags)` sets many flags at once.

## Server Actions

- `toggleFeatureFlagAction`, `setFeatureFlagAction`, `getFeatureFlagsAction` wrap the server API and revalidate `/` and `/system/flags`.

## Client Hooks

- `useFeatureFlag(flag, initialValue)` stores the flag in local state.
- `useFeatureFlags(initialFlags)` manages a map of flags with helpers to update and read.
- Client hooks require initial flag values passed from a server component.
