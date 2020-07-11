const { modifyVars } = require('../glob/lessModifyVars');
const { isProductionFn } = require('../../build/utils');

function createCss(isProd) {
  return {
    requireModuleExtension: true,
    extract: isProd ? { ignoreOrder: true } : false,
    sourceMap: false,
    loaderOptions: {
      css: {
        modules: {
          // https://github.com/webpack/loader-utils#interpolatename
          localIdentName: isProductionFn()
            ? '[contenthash:5]'
            : '[folder]__[name]_[local]-[emoji]$',
        },
      },
      less: {
        lessOptions: {
          modifyVars: modifyVars,
          javascriptEnabled: true,
        },
      },
    },
  };
}

module.exports = {
  createCss,
};
