module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    // sourceType: 'module',
  },
  extends: ['airbnb-base', 'plugin:vue/base'],
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    'vue',
  ],
  settings: {
    // these modules are included in nuxt.js
    'import/core-modules': ['vue', 'vuex'],
  },
  // add your custom rules here
  rules: {
    'max-len': 'off',

    // temporary allow dangle, bad decision in the past, at api level
    'no-underscore-dangle': 'off',

    // Because the use of @, eslint does not know
    'import/no-unresolved': 'off',

    // allow state shadow
    'no-shadow': ['error', { builtinGlobals: false, allow: ['state'] }],

    // Becaus these rules are stupid as fuck
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',

    /*
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    */
  },
};
