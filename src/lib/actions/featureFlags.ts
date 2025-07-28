'use server';

import { revalidatePath } from 'next/cache';
import { getFeatureFlags, setFeatureFlag, toggleFeatureFlag } from '@/lib/featureFlags';
import type { FeatureFlagName } from '@/lib/featureFlags/constants';

/**
 * Server action to toggle a feature flag
 */
export async function toggleFeatureFlagAction(flagName: FeatureFlagName) {
  try {
    const newValue = await toggleFeatureFlag(flagName);

    // Revalidate all pages that might use feature flags
    revalidatePath('/');
    revalidatePath('/system/flags');

    return {
      success: true,
      newValue,
      message: `Feature flag "${flagName}" ${newValue ? 'enabled' : 'disabled'}`,
    };
  } catch (error) {
    console.error('Error toggling feature flag:', error);
    return {
      success: false,
      error: 'Failed to toggle feature flag',
    };
  }
}

/**
 * Server action to set a specific feature flag value
 */
export async function setFeatureFlagAction(flagName: FeatureFlagName, value: boolean) {
  try {
    await setFeatureFlag(flagName, value);

    // Revalidate all pages that might use feature flags
    revalidatePath('/');
    revalidatePath('/system/flags');

    return {
      success: true,
      newValue: value,
      message: `Feature flag "${flagName}" ${value ? 'enabled' : 'disabled'}`,
    };
  } catch (error) {
    console.error('Error setting feature flag:', error);
    return {
      success: false,
      error: 'Failed to set feature flag',
    };
  }
}

/**
 * Server action to get all feature flags (for client components)
 */
export async function getFeatureFlagsAction() {
  try {
    const flags = await getFeatureFlags();
    return {
      success: true,
      flags,
    };
  } catch (error) {
    console.error('Error getting feature flags:', error);
    return {
      success: false,
      error: 'Failed to get feature flags',
      flags: {},
    };
  }
}
