const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  assetsDir: 'assets',
  devServer: {
    // historyApiFallback: true, // 不跳转
    // inline: true, // 实时刷新
    https: true, // 开启https
    port: 9999, // 端口号
    host: '0.0.0.0',  // 项目地址
 } 
});
