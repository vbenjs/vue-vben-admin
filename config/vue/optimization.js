// const { isProductionFn, isDevFn } = require('../../build/utils');
const resolve = require('../../build/getCwdPath');
// const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// function createScriptExtPlugin(config) {
//   config
//     .plugin('ext-script')
//     .after('html')
//     .use(ScriptExtHtmlWebpackPlugin, [
//       {
//         inline: /\_r.*\.js$/,
//         // defer: /\.js$/,
//       },
//     ])
//     .end();
// }

function configOptimization(config) {
  // config.when(isProductionFn(), (config) => {
  // createScriptExtPlugin(config);

  config.optimization.runtimeChunk({
    name: (entry) => `_r-${entry.name}`,
  });
  // config.optimization.runtimeChunk('single');
  config.optimization.splitChunks({
    chunks: 'all',
    maxAsyncRequests: 6, //分割后，按需加载的代码块最多允许的并行请求数，在webpack5里默认值变为6
    maxInitialRequests: 5, //分割后，入口代码块最多允许的并行请求数，在webpack5里默认值变为4
    // maxInitialRequests: Infinity,
    automaticNameMaxLength: 15, // 分割chunk自动命名最大长度
    automaticNameDelimiter: '.', // 分割chunk自动命名分隔符
    minSize: 30000, // 大小超过30kb的模块才会被提取
    maxSize: 0, // 只是提示，可以被违反，会尽量将chunk分的比maxSize小，当设为0代表能分则分，分不了不会强制
    minChunks: 1, //某个模块至少被多少代码块引用，才会被提取成新的chunk
    name: true, //每个缓存组打包得到的代码块的名称
    cacheGroups: {
      default: false,
      // light: {
      //   name: 'theme-light',
      //   test: (m, c) => {
      //     return (
      //       m.constructor.name === 'CssModule' &&
      //       new RegExp('-light.less|theme=light').test(m._identifier)
      //     );
      //   },
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 40,
      // },
      // dark: {
      //   name: 'theme-dark',
      //   test: (m, c) => {
      //     return (
      //       m.constructor.name === 'CssModule' &&
      //       new RegExp('-dark.less|theme=dark').test(m._identifier)
      //     );
      //   },
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 40,
      // },
      styles: {
        name: 'styles',
        test: /\.(css|scss|sass|less|styl)$/,
        chunks: 'async',
        // enforce: true,
        priority: 30,
      },
      commons: {
        name: 'commons.chunk',
        test: resolve('src/components'),
        minChunks: 3,
        priority: 20,
        reuseExistingChunk: true,
      },
      vendor: {
        priority: 10,
        reuseExistingChunk: true,
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)(.*?)([\\/]|$)/);
          let packageName = match[1];
          // if (match[1] === '@xxx') {
          //   packageName += `-${match[3]}`;
          // }
          if (
            packageName.indexOf('axios') !== -1 ||
            packageName.indexOf('babel') !== -1 ||
            packageName.indexOf('crypto-js') !== -1 ||
            packageName.indexOf('moment') !== -1 ||
            packageName.indexOf('lodash') !== -1 ||
            packageName.indexOf('mutationobserver') !== -1 ||
            packageName.indexOf('resize-observer-polyfill') !== -1 ||
            packageName.indexOf('vue') !== -1 ||
            packageName.indexOf('dom-align') !== -1 ||
            packageName.indexOf('async-validator') !== -1 ||
            packageName.indexOf('readable-stream') !== -1 ||
            packageName.indexOf('browserify-sign') !== -1 ||
            packageName.indexOf('regenerator-runtime') !== -1 ||
            packageName.indexOf('core-js') !== -1
          ) {
            packageName = 'entry-lib';
          } else if (packageName.indexOf('ant-design') !== -1) {
            packageName = 'design';
          } else if (
            packageName.indexOf('echarts') !== -1 ||
            packageName.indexOf('vue-baidu-map') !== -1
          ) {
            packageName = 'chart';
          }
          // else {
          //   packageName = 'vendor';
          // }
          // const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
          return `${packageName.replace('@', '')}.chunk`;
        },
      },
    },
  });
  // });
}

module.exports = {
  configOptimization,
};
