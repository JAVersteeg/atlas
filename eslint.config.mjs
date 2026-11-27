// ESLint flat config: the CLAUDE.md conventions a tool can check, on top of Expo's defaults.
import { defineConfig, globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import atlas from './eslint-rules/index.mjs';

export default defineConfig([
  expoConfig,
  globalIgnores(['.claude/**', 'android/**', 'ios/**', 'dist/**', 'supabase/**']),
  {
    plugins: { atlas },
    rules: {
      'react-hooks/exhaustive-deps': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import/no-duplicates': 'error',
      // The copy is Dutch: apostrophes in JSX text ("zo'n", "'t") render fine.
      'react/no-unescaped-entities': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['..', '../**'],
              message: 'Import with `@/` (→ src/), not a relative parent path.',
            },
          ],
          paths: [
            {
              name: 'date-fns',
              importNames: ['parseISO'],
              message:
                'parseISO reads a midnight timestamp as the day before west of UTC. Compare days as yyyy-MM-dd strings.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Use a named export. Only App.tsx has a default export.',
        },
        {
          selector:
            "CallExpression[callee.object.name='StyleSheet'][callee.property.name='create']",
          message: 'Style with NativeWind `className`; inline `style` is for dynamic values.',
        },
      ],
      'atlas/no-hardcoded-hex': 'error',
      'atlas/supabase-error-handled': 'error',
    },
  },
  {
    files: ['src/theme/palette.ts', 'src/**/*.test.ts'],
    rules: { 'atlas/no-hardcoded-hex': 'off' },
  },
  { files: ['App.tsx'], rules: { 'no-restricted-syntax': 'off' } },
]);
