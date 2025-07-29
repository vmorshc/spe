import {
  getFeatureFlagsFromSession,
  resetFeatureFlagsInSession,
  setFeatureFlagInSession,
  setFeatureFlagsInSession,
} from '@/lib/auth/session';
import { type FeatureFlagName, getDefaultFeatureFlags } from './constants';

/**
 * Get all feature flags from session, with defaults for missing flags
 */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const sessionFlags = await getFeatureFlagsFromSession();
  const defaultFlags = getDefaultFeatureFlags();

  // Merge session flags with defaults, prioritizing session values
  return {
    ...defaultFlags,
    ...(sessionFlags || {}),
  };
}

/**
 * Get a specific feature flag value
 */
export async function getFeatureFlag(flagName: FeatureFlagName): Promise<boolean> {
  const flags = await getFeatureFlags();
  return flags[flagName] ?? false;
}

/**
 * Set a specific feature flag value
 */
export async function setFeatureFlag(flagName: FeatureFlagName, value: boolean): Promise<void> {
  await setFeatureFlagInSession(flagName, value);
}

/**
 * Toggle a specific feature flag value
 */
export async function toggleFeatureFlag(flagName: FeatureFlagName): Promise<boolean> {
  const currentValue = await getFeatureFlag(flagName);
  const newValue = !currentValue;
  await setFeatureFlag(flagName, newValue);
  return newValue;
}

/**
 * Reset all feature flags to their default values
 */
export async function resetFeatureFlags(): Promise<void> {
  const defaultFlags = getDefaultFeatureFlags();
  await resetFeatureFlagsInSession(defaultFlags);
}

/**
 * Set multiple feature flags at once
 */
export async function setFeatureFlags(
  flags: Partial<Record<FeatureFlagName, boolean>>
): Promise<void> {
  await setFeatureFlagsInSession(flags);
}
