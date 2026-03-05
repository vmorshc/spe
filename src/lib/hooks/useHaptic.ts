import { useWebHaptics } from 'web-haptics/react';

export function useHaptic() {
  const { trigger, isSupported } = useWebHaptics();
  return { haptic: trigger, isSupported };
}
