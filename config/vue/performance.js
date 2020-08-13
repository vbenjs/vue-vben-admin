// const webpack = require('webpack');
const { isProductionFn, isDevFn } = require('../../build/utils');
module.exports = {
  configPerformance(config) {
    config.optimization.minimize(isProductionFn());
    config.cache(true);
    config.resolve.symlinks(false);
    config.performance.hints(false);
    config.module.noParse(/^(vue|vue-router|vuex|lodash|moment|vuex-router-sync|normalize.css)$/);

    config.when(isProductionFn(), (config) => {
      config.merge({ recordsPath: require('path').resolve('build/.cache/~records') });
      config.plugins.delete('prefetch').delete('preload');
    });

    config.when(isDevFn(), (config) => {
      config.watchOptions({ ignored: /node_modules/ });
    });
  },
};
