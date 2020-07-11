const webpack = require('webpack');
const pkg = require('../../package.json');
const { isProductionFn } = require('../../build/utils');

function createBannerPlugin(config) {
  // bannerPlugin

  config.when(isProductionFn(), (config) => {
    config
      .plugin('banner')
      .use(webpack.BannerPlugin, [
        {
          banner:
            `Build by ${pkg.author || 'vben'} ,Version:${process.env.VUE_APP_VERSION} ` +
            new Date().toLocaleDateString(),
        },
      ])
      .end();
  });
}

module.exports = {
  createBannerPlugin,
};
