'use client';

import { useState } from 'react';
import type { FeatureFlagName } from './constants';

/**
 * Hook to use a specific feature flag in client components
 * Note: This requires the feature flag to be passed from server components
 * since we cannot access iron-session directly on the client
 */
export function useFeatureFlag(_flagName: FeatureFlagName, initialValue: boolean = false) {
  const [isEnabled, setIsEnabled] = useState(initialValue);

  // This hook is primarily for receiving updates from server components
  // The actual value should be passed down from server components
  return {
    isEnabled,
    setIsEnabled, // For manual updates if needed
  };
}

/**
 * Hook to manage multiple feature flags
 */
export function useFeatureFlags(initialFlags: Record<string, boolean> = {}) {
  const [flags, setFlags] = useState(initialFlags);

  const updateFlag = (flagName: string, value: boolean) => {
    setFlags((prev) => ({
      ...prev,
      [flagName]: value,
    }));
  };

  const updateFlags = (newFlags: Record<string, boolean>) => {
    setFlags((prev) => ({
      ...prev,
      ...newFlags,
    }));
  };

  return {
    flags,
    updateFlag,
    updateFlags,
    getFlag: (flagName: string) => flags[flagName] ?? false,
  };
}
