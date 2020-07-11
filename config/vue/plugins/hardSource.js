const { isDevFn, getEnvFn } = require('../../../build/utils');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const notCache = getEnvFn().VUE_APP_USE_CACHE !== 'TRUE';

function createHardSourcePlugin(config) {
  if (notCache || isDevFn()) {
    return;
  }
  config.plugin('hard-source').use(HardSourceWebpackPlugin);
  const tests = isDevFn()
    ? [{ test: /[\\/]src[\\/]/ }]
    : [
        { test: /[\\/]mini-css-extract-plugin[\\/]dist[\\/]loader/ },
        { test: /[\\/]file-loader[\\/]/ },
        { test: /[\\/]url-loader[\\/]/ },
      ];
  config.plugin('hard-source-exclude').use(HardSourceWebpackPlugin.ExcludeModulePlugin, tests);
}

module.exports = {
  createHardSourcePlugin,
};
