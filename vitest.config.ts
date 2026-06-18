import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Expose describe/it/expect/vi as globals so test files need no per-file
    // imports — mirrors the implicit globals jest provided.
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    // jest 27 printed `Object {` / `Array [` prefixes; keep them so existing
    // snapshots stay byte-identical across the framework switch.
    snapshotFormat: {
      printBasicPrototype: true,
    },
    coverage: {
      provider: 'v8',
      // No `include`: like jest's unset collectCoverageFrom, only files loaded
      // during tests are measured.
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: -10,
      },
    },
  },
});
