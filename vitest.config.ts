import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/**/*.{ts, tsx}'],
      exclude: ['src/**/*.stories.{ts, tsx}', 'src/**/*.test.{ts, tsx}', 'index.ts', 'types.ts'],
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
