const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
const { isProductionFn } = require('../../../build/utils');
const resolve = require('../../../build/getCwdPath');

function createSkeletonPlugin(config) {
  config.when(isProductionFn(), (config) => {
    const main = resolve('src/setup/skeleton/index.js');
    config.plugin('skeleton').use(SkeletonWebpackPlugin, [
      {
        webpackConfig: {
          entry: {
            main: main,
          },
        },
        minimize: true,
      },
    ]);
  });
}
module.exports = {
  createSkeletonPlugin,
};
