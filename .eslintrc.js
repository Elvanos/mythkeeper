module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:vue/essential",
    "plugin:vue/recommended",
    "plugin:vue/strongly-recommended",
    "@vue/typescript",
    //'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "quotes": [1, "double"],
    "semi": [1, "never"],
    "curly": [1, "all"],
    "no-trailing-spaces": [1],
    //"indent": [2, 2],
    "@typescript-eslint/indent": [1, 2],
    "vue/no-v-html": [0],
    "vue/max-attributes-per-line": [
      1,
      {
        singleline: 2,
        multiline: {
          max: 2,
          allowFirstLine: false
        }
      }
    ]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
}
