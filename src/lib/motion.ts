// Spring presets
export const springPresets = {
  gentle: { type: 'spring' as const, stiffness: 100, damping: 15 },
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  bouncy: { type: 'spring' as const, stiffness: 200, damping: 10 },
};

// Reusable gesture props
export const tapScale = {
  whileTap: { scale: 0.97 },
  transition: { duration: 0.1 },
};
