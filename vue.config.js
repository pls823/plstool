const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    port: process.env.port,
    proxy: {
      '/': {
        target: 'https://zyxh.maytek.cn',
        // target: 'https://xhyz.maytek.cn',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/': ''
        }
      },
    }
  }
})
