import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...ts.configs.recommended,
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
  },
  {
    files: ['server/**/*.js', 'scripts/**/*.js', 'vite.config.js', 'vitest.config.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        performance: 'readonly',
        
        // Service worker specific
        self: 'readonly',
        caches: 'readonly',
        Response: 'readonly',
        URL: 'readonly',
        clients: 'readonly',
        
        // Node.js globals for some files
        module: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-unused-vars': 'off',
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/no-parsing-error': 'off',
      'vue/valid-template-root': 'off',
    },
  },
  {
    ignores: [
      'dist/**', 
      'node_modules/**', 
      '*.d.ts',
      'public/js/**',  // Skip linting for public JS files (might be external/generated)
      'public/css/**', // Skip CSS files
      'src/**/*.vue',  // Temporarily skip Vue files until parser is fixed
    ],
  },
]