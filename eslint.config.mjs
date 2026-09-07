import js from '@eslint/js';

export default [
  {
    ignores: [
      // Dependencies
      '**/node_modules/**',

      // Build output
      '**/dist/**',
      '**/coverage/**',
      '**/.vite/**',
      '**/.turbo/**',
      '**/storybook-static/**',

      // Test output
      '**/playwright-report/**',
      '**/test-results/**',

      // GitHub
      '.github/**',

      // Generated TypeScript
      '**/*.d.ts',
      '**/*.tsbuildinfo',

      // Source maps
      '**/*.js.map',
      '**/*.d.ts.map',

      // OS files
      '**/.DS_Store'
    ]
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        console: 'readonly',
        process: 'readonly',
        document: 'readonly',
        window: 'readonly',
        global: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Event: 'readonly',
        MutationObserver: 'readonly'
      }
    },

    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
];