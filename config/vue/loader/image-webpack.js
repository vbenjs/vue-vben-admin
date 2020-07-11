const { isProductionFn } = require('../../../build/utils');

// Turn on image compression
function createImageLoader(config) {
  config.when(isProductionFn(), (config) => {
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
      })
      .end();
  });
}
module.exports = {
  createImageLoader,
};
