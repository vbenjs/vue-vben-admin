const webpack = require('webpack');
const { isProductionFn } = require('../../../build/utils');

module.exports = {
  configIgnorePlugin(config) {
    config.plugin('ignore').use(
      new webpack.ContextReplacementPlugin(/\/request\//, (data) => {
        delete data.dependencies[0].critical;
        return data;
      })
    );

    config.when(isProductionFn(), (config) => {
      config.plugin('ignore').use(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    });
  },
};
