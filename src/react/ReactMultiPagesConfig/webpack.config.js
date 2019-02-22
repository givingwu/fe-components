const { resolve } = require('path');
// const webpack = require('webpack');
const webpackrc = require('./.webpackrc');
const htmlTemplates = require('./.htmlrc');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const templates = htmlTemplates.map(template => merge({}, template, {
  inject: 'body',
  template: resolve(__dirname, webpackrc.html.template),
  minify: { // reference: `html-minifier`
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  }
}))

module.exports = function webpackConfig(config) {
  const plugins = config.plugins;

  if (templates && templates.length) {
    for (let i = 0, l = templates.length; i < l; i++) {
      const htmlConfig = templates[i];

      if (webpackrc.commons && webpackrc.commons.length) {
        htmlConfig.chunks.unshift('common')
      }

      plugins.push(new HtmlWebpackPlugin(htmlConfig))
    }
  }

  return config;
}

function merge(target, ...args) {
	return Object.assign({}, target, ...args)
}
