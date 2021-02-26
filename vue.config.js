const fs = require("fs");
const path = require("path");

module.exports = {
  pages: {
    index: {
      entry: "src/renderer/main.js",
      template: "public/editor.html"
    }
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: "src/main/background.js",
      preload: "src/main/preload.js",
      builderOptions: {
        productName: "rto",
        linux: {
          target: "AppImage",
          category: "Utility"
        },
      }
    },
  },
  chainWebpack(config) {
    const root = path.join(__dirname, "src", "renderer");
    config.resolve.alias.set("@@", root);
    fs.readdirSync(root, { withFileTypes: true })
      .filter(i => i.isDirectory())
      .forEach(i => config.resolve.alias.set(i.name, path.join(root, i.name)));
  },
  devServer: {
    proxy: {
      '/assets': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
      '/oss': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
      '/app': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
      '/predict': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
      '/component': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
      '/system': {
        target: 'http://10.88.34.96:7000',
        // target: 'https://spnext.xuelangyun.com/',
        ws: true,
        changeOrigin: true
      },
    }
  }
};
