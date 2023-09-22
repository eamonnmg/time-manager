/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    node: true,
  },
  plugins: [
    "@typescript-eslint",
    "tailwindcss"
  ],
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier'
  ],
  parser: "vue-eslint-parser",
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "tailwindcss/no-custom-classname": "off",
    "vue/v-on-event-hyphenation": "off",
  }
}