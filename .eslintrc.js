module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    'plugin:vue/base',
    '@nuxtjs'
  ],
  /*
    env: {
        browser: true,
        node: true,
    },
    plugins: [
        'vue',
    ],
    */
  // add your custom rules here
  rules: {
    indent: ['error', 2],
    // allow state shadow
    'no-shadow': ['error', { builtinGlobals: false, allow: ['state'] }],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }]
  }
}
