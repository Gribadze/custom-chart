module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'plugin:react/recommended',
    'plugin:flowtype/recommended',
    // 'plugin:flowtype-errors/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'react',
    'jsx-a11y',
    'import',
    'flowtype',
    'jest',
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'prettier/prettier': ['error'],
  },
};
