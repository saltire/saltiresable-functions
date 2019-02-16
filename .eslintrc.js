module.exports = {
  parserOptions: {
    sourceType: 'script',
  },
  extends: 'airbnb-base',
  rules: {
    'brace-style': [2, 'stroustrup'],
    'function-paren-newline': 0,
    'no-bitwise': 0,
    'no-console': 0,
    'no-multi-assign': 0,
    'no-nested-ternary': 0,
    'object-curly-newline': [2, { multiline: true, consistent: true }],
    'operator-linebreak': [2, 'after'],
    'radix': [2, 'as-needed'],
    'strict': [2, 'global'],
  },
};
