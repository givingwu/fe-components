const path = require('path');
const htmlTemplates = require('./.htmlrc');

const resolveApp = (file) => path.resolve(__dirname, file);
const getEntries = () => htmlTemplates.reduce((entries, template) => {
  entries[template.chunks[0]] = template.entry;
  return entries;
}, {})

// configuration document:
// https://github.com/sorrycc/roadhog/blob/master/README_zh-cn.md
module.exports = {
  entry: getEntries(),
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  extraBabelPlugins: [
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": true }, 'antd'],
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "es", "style": true }, "ant-mobile"]
  ],
  commons: [
    {
      name: 'common',
      minChunks: function(module) {
        return module.context && module.context.includes('node_modules');
      }
    },
    // 'react',
    // 'react-dom',
    // 'antd',
    // 'antd-mobile',
  ],
  alias: {
    src: resolveApp('./src'),
    assets: resolveApp('./src/assets'),
    pages: resolveApp('./src/pages'),
    common: resolveApp('./src/common'),
    components: resolveApp('./src/components'),
    services: resolveApp('./src/services'),
    models: resolveApp('./src/models'),
    common: resolveApp('./src/common'),
    utils: resolveApp('./src/utils'),
  },
  ignoreMomentLocale: true,
  externals: {
    // "react": 'React',
		// 'react-dom': 'ReactDOM',
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  html: {
    template: './public/index.ejs'
  },
  publicPath: '/',
  define: {
    PUBLIC_URL: './public'
  },
  hash: true,
  "proxy": {
    "/api": {
      "target": "http://devgate.feewee.cn",
      "changeOrigin": true,
      "pathRewrite": {"^/api": ""},
      onProxyReq: function (_, req) {
        console.log(`into proxy setting => ["${req.url}"]: `, );
        console.log(``);
      }
    },
    // for Mr. Wang
    "/wang": {
      "target": "http://192.168.0.115:8030",
      "changeOrigin": true,
      "pathRewrite": {"^/wang": ""}
    },
    // for Miss. Tang
    "/tang": {
      "target": "http://192.168.0.119:8080",
      "changeOrigin": true,
      "pathRewrite": {"^/tang": ""}
    },
    "/admin": {
      "target": "http://devgate.feewee.cn",
      "changeOrigin": true
    }
  }
};
