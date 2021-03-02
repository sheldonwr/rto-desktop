const fs = require("fs");
const path = require("path");

const entryTemplate = process.env.NODE_ENV !== 'production' ? "public/editor.dev.html" : "public/editor.prod.html";

module.exports = {
  pages: {
    index: {
      entry: "src/renderer/main.js",
      template: entryTemplate
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
        extraResources: [
          {
            from: "./src/main/assets/",
            to: "assets",
            filter: ["**/*"]
          },
        ]
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
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
      '/oss': {
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
      '/app': {
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
      '/predict': {
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
      '/component': {
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
      '/system': {
        // target: 'http://10.88.34.96:7000',
        target: 'http://10.88.36.102/',
        ws: true,
        changeOrigin: true
      },
    }
  }
};
