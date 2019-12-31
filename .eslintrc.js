module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  // overrides: [{
  //   files: [
  //     "**/*.test.js"
  //   ],
  //   env: {
  //     jest: true // now **/*.test.js files' env has both es6 *and* jest
  //   },
  //   plugins: ['jest'],
  // }],
  extends: [
    'airbnb-base',
    // 'plugin:jest/recommended',
    // 'plugin:jest/style',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "brace-style": ["error", "stroustrup"],
  },
};
