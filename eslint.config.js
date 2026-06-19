import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

// Lean, modern flat config: ESLint + typescript-eslint recommended base, plus
// import hygiene (import-x) and vitest rules for tests. Formatting is owned by
// Prettier (run separately) — eslint-config-prettier disables conflicting rules.
export default tseslint.config(
  {
    ignores: [
      'build/**',
      'examples/**',
      // CJS cosmiconfig fixtures (intentionally non-ESM, validated by tests)
      'src/cli/config/__fixtures__/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  importX.flatConfigs.recommended,
  {
    settings: {
      // import-x v4 resolver API — resolves .ts extensions, node builtins,
      // and @types packages against the project's tsconfig.
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: './tsconfig.json',
        }),
      ],
    },
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      // Source uses explicit .ts extensions (NodeNext + node-native execution);
      // tsc rewrites them to .js on emit, so the extensions are intentional.
      'import-x/extensions': 'off',
      // Allow intentionally-unused args/vars prefixed with underscore.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    ...vitest.configs.recommended,
  },
  {
    // Tests deliberately pass invalid inputs cast through `any`.
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  prettier
);
