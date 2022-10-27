const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  assetsDir: 'assets'
});
