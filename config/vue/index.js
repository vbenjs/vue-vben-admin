require('./env')();
const { isProductionFn, getEnvFn } = require('../../build/utils');
const resolve = require('../../build/getCwdPath');

const { createDevServer } = require('./devServer');
const { configAlias } = require('./alias');
const { createCss } = require('./css');
const { configSourceMap } = require('./sourceMap');
const { createBannerPlugin } = require('./banner');
const { configPerformance } = require('./performance');
const { configOptimization } = require('./optimization');
const { configHtml } = require('./html');
const { getPublicPath } = require('./getPath');
const { configEntry } = require('./entry');

const { configVueLoader } = require('./loader/vue-loader');
const { createSvgLoader } = require('./loader/svg-loader');
const { createImageLoader } = require('./loader/image-webpack');
const { createWorkerLoader } = require('./loader/worker-loader');

const { createGzip } = require('./plugins/gzip');
const { createHardSourcePlugin } = require('./plugins/hardSource');
const { configIgnorePlugin } = require('./plugins/ignore');
const { createReport } = require('./plugins/report');
const { configClean } = require('./plugins/clean');
const { createWebpackBar } = require('./plugins/processBar');
const { createStyleLintPlugin } = require('./plugins/stylelint');
const { configDefinePlugin } = require('./plugins/define');
const { createThemeColorReplacerPlugin } = require('./plugins/theme');
const isProd = isProductionFn();
const ENV = getEnvFn();

function createVueConfig() {
  return {
    publicPath: getPublicPath(),
    lintOnSave: !isProd,
    assetsDir: ENV.VUE_APP_ASSETS_DIR,
    productionSourceMap: false,
    devServer: createDevServer(),
    pluginOptions: {
      lintStyleOnBuild: true,
      stylelint: {},
    },
    css: createCss(isProd),
    configureWebpack: (config) => {
      config.resolve.extensions = ['.js', '.jsx', '.tsx', '.ts'];
      configEntry(config);
    },
    chainWebpack: (config) => {
      config.name = ENV.GLOB_APP_SHORT_NAME;
      configIgnorePlugin(config);
      // alias
      configAlias(config);
      // sourceMap设置
      configSourceMap(config);
      // Performance
      configPerformance(config);
      // Optimization
      configOptimization(config);
      // env
      configDefinePlugin(config);
      // html config
      configHtml(config);
      // vue-loader config
      configVueLoader(config);
      // icon
      createSvgLoader(config);
      // web-worker
      createWorkerLoader(config);
      // banner
      createBannerPlugin(config);
      // build report
      createReport(config);
      // cache
      createHardSourcePlugin(config);
      // clean build dist
      configClean(config);

      // build process bar
      createWebpackBar(config);
      // Picture compression
      // createImageLoader(config);
      // stlyelint
      createStyleLintPlugin(config);
      // gzip
      createGzip(config);
      createThemeColorReplacerPlugin(config);
    },
  };
}
module.exports = {
  createVueConfig,
};
