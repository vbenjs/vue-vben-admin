const { isProductionFn } = require('../../build/utils');
module.exports = {
  configSourceMap(config) {
    config.devtool(isProductionFn() ? false : 'cheap-eval-source-map');
  },
};
