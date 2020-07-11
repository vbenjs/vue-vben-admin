const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const { isProductionFn } = require('../../../build/utils');
function configClean(config) {
  config.when(isProductionFn(), (config) => {
    let noCleanDir = ['**/*', '!window-glob.js'];
    config.plugin('clean').use(CleanWebpackPlugin, [
      {
        cleanOnceBeforeBuildPatterns: noCleanDir, // Do not delete files in the dll directory
      },
    ]);
  });
}

module.exports = {
  configClean,
};
