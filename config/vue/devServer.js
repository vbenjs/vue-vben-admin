const path = require('path');
const { getEnvFn } = require('../../build/utils');
const mockMiddleware = require('../../build/middleware/mockMiddleware.js');

const ENV = getEnvFn();

let proxyList = ENV.VUE_APP_PROXY || [];

function createProxy() {
  const proxyResult = {};
  try {
    proxyList = JSON.parse(proxyList);
    if (!Array.isArray(proxyList) || proxyList.length <= 0) {
      return {};
    }
    for (const [key, target] of proxyList) {
      proxyResult[key] = {
        target: target,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ['^' + key]: '',
        },
      };
    }
    return {
      proxy: proxyResult,
    };
  } catch (error) {}

  return {};
}

function createDevServer() {
  const { VUE_APP_USE_MOCK } = ENV;

  return {
    disableHostCheck: true,
    open: false,
    host: '0.0.0.0',
    port: ENV.VUE_APP_PORT,
    https: false,
    hotOnly: true,
    compress: true,
    clientLogLevel: 'warn',
    overlay: {
      warnings: false,
      errors: true,
    },
    before: (app) => {
      VUE_APP_USE_MOCK === 'TRUE' && app.use(mockMiddleware());
    },
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join('/', 'index.html'),
        },
      ],
    },
    ...createProxy(),
  };
}
module.exports = {
  createDevServer,
};
