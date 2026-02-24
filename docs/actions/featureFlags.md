# Feature Flag Actions

Source: `src/lib/actions/featureFlags.ts`

Purpose: Read and mutate session-based feature flags from server actions.

## Methods

### `toggleFeatureFlagAction(flagName)`
Takes: `flagName: FeatureFlagName`.
Returns: `Promise<{ success: boolean; newValue?: boolean; message?: string; error?: string }>`.
How it works: toggles a flag in session, revalidates `/` and `/system/flags`.

### `setFeatureFlagAction(flagName, value)`
Takes: `flagName: FeatureFlagName`, `value: boolean`.
Returns: `Promise<{ success: boolean; newValue?: boolean; message?: string; error?: string }>`.
How it works: sets a specific flag in session and revalidates `/` and `/system/flags`.

### `getFeatureFlagsAction()`
Takes: no params.
Returns: `Promise<{ success: boolean; flags: Record<string, boolean>; error?: string }>`.
How it works: reads merged flags (defaults + session) and returns them for client use.
