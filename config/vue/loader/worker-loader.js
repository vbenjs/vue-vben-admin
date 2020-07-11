const { getPublicPath } = require('../getPath');
const { getEnvFn } = require('../../../build/utils');
const resolve = require('../../../build/getCwdPath');

function createWorkerLoader(config) {
  config.module
    .rule('web-workers')
    .merge(config.module.rule('ts').toConfig())
    .test(/(?:\.worker|[\\/]workers[\\/]\w+)\.[tj]s$/)
    .include.add(resolve('src'))
    .end()
    .use('worker-loader')
    .loader('worker-loader')
    .options({
      name: getEnvFn().VUE_APP_ASSETS_DIR + '/js/[name].[hash:3].worker.js',
      fallback: true,
      publicPath: getPublicPath(),
    })
    .after('0');
}

module.exports = {
  createWorkerLoader,
};
