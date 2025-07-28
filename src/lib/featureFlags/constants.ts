/**
 * Feature flag names - used as keys in the feature flags object
 */
export const FEATURE_FLAGS = {
  INSTAGRAM_MVP: 'instagram_mvp',
} as const;

export type FeatureFlagName = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

/**
 * Feature flag definitions with metadata
 */
export interface FeatureFlagDefinition {
  name: FeatureFlagName;
  displayName: string;
  description: string;
  defaultValue: boolean;
}

export const FEATURE_FLAG_DEFINITIONS: FeatureFlagDefinition[] = [
  {
    name: FEATURE_FLAGS.INSTAGRAM_MVP,
    displayName: 'Instagram MVP',
    description: 'Увімкнути функціонал Instagram включаючи вхід та функції розіграшу',
    defaultValue: false,
  },
];

/**
 * Get default feature flags object
 */
export function getDefaultFeatureFlags(): Record<string, boolean> {
  return FEATURE_FLAG_DEFINITIONS.reduce(
    (acc, flag) => {
      acc[flag.name] = flag.defaultValue;
      return acc;
    },
    {} as Record<string, boolean>
  );
}
