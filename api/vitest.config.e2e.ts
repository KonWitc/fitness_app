import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      // Test-only signing key, so the suite runs without one in api/.env.
      // DATABASE_URL still comes from api/.env (or the environment).
      JWT_SECRET:
        process.env.JWT_SECRET ?? 'e2e-only-secret-not-for-real-use-0123456789',
    },
  },
});
