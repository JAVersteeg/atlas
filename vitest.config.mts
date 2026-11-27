import { resolve } from 'node:path';

import { defineConfig } from 'vitest/config';

// Unit tests run in plain Node: only pure modules (no React Native, Expo or Supabase client).
export default defineConfig({
  resolve: {
    alias: { '@': resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A test never depends on where it runs.
    env: { TZ: 'Europe/Amsterdam' },
  },
});
