const { isProductionFn, isSiteModeFn } = require('../../../build/utils');
const { gzip: zopGzip } = require('@gfx/zopfli');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = /\.(js|css|svg|woff|ttf|json|html)(\?.*)?$/i;

function createGzip(config) {
  config.when(
    isProductionFn() && (process.env.BUILD_ON_GZIP === 'TRUE' || isSiteModeFn()),
    (config) => {
      config.plugin('compression').use(CompressionWebpackPlugin, [
        {
          cache: true,
          exclude: /.+\.html$/,
          algorithm(input, compressionOptions, callback) {
            return zopGzip(input, compressionOptions, callback);
          },
          compressionOptions: {
            numiterations: 15,
          },
          threshold: 5120,
          minRatio: 0.7,
          test: productionGzipExtensions,
        },
      ]);
    }
  );
}

module.exports = {
  createGzip,
};
