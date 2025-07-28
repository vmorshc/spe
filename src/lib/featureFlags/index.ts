import { getSession } from '@/lib/auth/session';
import { type FeatureFlagName, getDefaultFeatureFlags } from './constants';

/**
 * Get all feature flags from session, with defaults for missing flags
 */
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const session = await getSession();
  const defaultFlags = getDefaultFeatureFlags();

  // Merge session flags with defaults, prioritizing session values
  return {
    ...defaultFlags,
    ...(session.featureFlags || {}),
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
  const session = await getSession();

  // Initialize featureFlags object if it doesn't exist
  if (!session.featureFlags) {
    session.featureFlags = {};
  }

  session.featureFlags[flagName] = value;
  await session.save();
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
  const session = await getSession();
  session.featureFlags = getDefaultFeatureFlags();
  await session.save();
}

/**
 * Set multiple feature flags at once
 */
export async function setFeatureFlags(
  flags: Partial<Record<FeatureFlagName, boolean>>
): Promise<void> {
  const session = await getSession();

  // Initialize featureFlags object if it doesn't exist
  if (!session.featureFlags) {
    session.featureFlags = {};
  }

  // Update each flag
  Object.entries(flags).forEach(([flagName, value]) => {
    if (value !== undefined) {
      session.featureFlags![flagName] = value;
    }
  });

  await session.save();
}
