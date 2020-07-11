const webpack = require('webpack');
const { isProductionFn } = require('../../../build/utils');

module.exports = {
  configIgnorePlugin(config) {
    config.when(isProductionFn(), (config) => {
      config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    });
  },
};
