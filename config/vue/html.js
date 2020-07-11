const { isProductionFn, isDevFn, getEnvFn } = require('../../build/utils');
const { getPublicPath } = require('./getPath');
const HtmlWebpackHardDiskPlugin = require('html-webpack-harddisk-plugin');

// Write html to disk, which is good for hmr
function createHardDiskPlugin(config) {
  config.plugin('hard-disk').after('html').use(HtmlWebpackHardDiskPlugin).end();
}
/**
 * @description: 通用配置
 */
function getMergeCommonOptions(filename = '') {
  const isDev = isDevFn();
  const ENV = getEnvFn();
  // Sort the chunks in the order in which they were introduced. Without this, the JS introduced into the html may be sorted out of order
  const chunksSortMode = 'none';
  // const chunksSortMode = 'manual';
  const title = ENV.GLOB_APP_TITLE || 'APP';
  const minify = {
    html5: true,
    ignoreCustomComments: [/^!/], // 保留的注释
    sortClassName: true, // class排序
    sortAttributes: true, // 属性排序
    processConditionalComments: true, // 处理条件注释(IE)
    removeStyleLinkTypeAttributes: true, // 去 link type="text/css"
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    removeComments: true, // 移除注释
    collapseWhitespace: true, // 去多余空格
    removeAttributeQuotes: true, // 去属性括号
    collapseBooleanAttributes: true, // Boolean属性简写
    removeScriptTypeAttributes: true, // 去script type属性
    minifyJS: { output: { comments: /^!/ } }, // 压缩script标签里的js
    minifyCSS: true,
    minifyURLs: true,
  };

  const addToHead = isDev
    ? ''
    : `<script  src='${getPublicPath()}window-glob.js?v=${
        ENV.VUE_APP_VERSION
      }-${new Date().getTime()}'></script>`;
  return { addToHead, chunksSortMode, title, minify, inject: true };
}
function configHtml(config) {
  config.when(isDevFn(), (config) => {
    config.plugin('html').tap((args) => {
      args[0].alwaysWriteToDisk = true;
      return args;
    });
    createHardDiskPlugin(config);
  });
  config.when(isProductionFn(), (config) => {
    config.plugin('html').tap((args) => {
      const { addToHead, chunksSortMode, title, minify, inject } = getMergeCommonOptions();
      args[0].addToHead = addToHead;
      // args[0].chunksSortMode = chunksSortMode;
      args[0].title = title;
      args[0].minify = minify;
      return args;
    });
  });
}

module.exports = {
  configHtml,
  getMergeCommonOptions,
};
