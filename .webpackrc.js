// configuration document:
// https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md
const path = require('path');
const resolveApp = (route) => path.resolve(__dirname, route)

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }],
  ],
  /* extraBabelIncludes: [
    "feewee"
  ], */
  define: {
    HOST: 'devlocal.feewee.cn',
    PORT: 3001,
    ESLINT: 'none',
    TSLINT: 'none',
  },
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  alias: {
    //feewee: resolveApp('feewee/src'),
    src: resolveApp('./src'),
    assets: resolveApp('./src/assets'),
    pages: resolveApp('./src/pages'),
    components: resolveApp('./src/components'),
    services: resolveApp('./src/services'),
    models: resolveApp('./src/models'),
    common: resolveApp('./src/common'),
    utils: resolveApp('./src/utils'),
  },
  html: {
    template: './src/index.ejs',
  },
  ignoreMomentLocale: true,
  // disableDynamicImport: true,
  publicPath: '/',
  hash: true,
  "proxy": {
    "/api": {
      "target": "http://devgate.feewee.cn",
      "changeOrigin": true,
      "pathRewrite": {"^/api": ""},
    },
    // for Mr. Wang
    "/wh": {
      "target": "http://192.168.0.126:8080",
      "changeOrigin": true,
      "pathRewrite": {"^/wang": ""}
    },
    // for Miss. Tang
    "/tmz": {
      "target": "http://192.168.0.119:8080",
      "changeOrigin": true,
      "pathRewrite": {"^/tang": ""}
    },
    "/admin": {
      "target": "http://devgate.feewee.cn",
      "changeOrigin": true
    },
    "/tmz":{
      "target": "http://192.168.0.119:8080",
      "changeOrigin": true,
      "pathRewrite": {"^/tmz": ""},
    }
  }
};
