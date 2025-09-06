module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'astro'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
    'prettier',
  ],
  rules: {
    'no-empty-pattern': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  ],
};
