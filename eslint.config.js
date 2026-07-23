import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // Existing screens intentionally initialize dialog and URL state in effects.
      // Revisit these compiler rules when screens are split into server/client layers.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    '.turbo/**',
    '.worktrees/**',
    'out/**',
    'build/**',
    'node_modules*/**',
    'next-env.d.ts',
    '**/*.tsbuildinfo',
  ]),
])
