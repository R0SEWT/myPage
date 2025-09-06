module.exports = {
  root: true,
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.astro'],
  },
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
  ignorePatterns: ['dist'],
};
