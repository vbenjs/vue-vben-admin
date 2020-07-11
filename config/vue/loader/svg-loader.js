const resolve = require('../../../build/getCwdPath');

const createSvgLoader = (config) => {
  config.module.rule('svg').exclude.add(resolve('src/assets/icons/svg/')).end();
  config.module
    .rule('svg-sprite-loader')
    .test(/\.svg(\?[a-z0-9=\.]+)?$/)
    .include.add(resolve('src/assets/icons/svg/'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]',
    })
    .end();
};

module.exports = {
  createSvgLoader,
};
