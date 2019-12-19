module.exports = {
  resolve: {
    alias: {
      "@": path.join(__dirname, "../src"),
      "vue$": "vue/dist/vue.esm.js"
    },
    extensions: [".js", ".vue", ".json"]
  },
}

