import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    unstubEnvs: true,
    setupFiles: ['tests/setup/vitest.setup.ts'],
    include: ['tests/**/*.test.ts', 'src/**/*.{test,spec}.ts'],
    hookTimeout: 120_000,
    testTimeout: 120_000,
  },
});
