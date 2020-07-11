const Webpackbar = require('webpackbar');
const { isProductionFn } = require('../../../build/utils');

function createWebpackBar(config) {
  config.when(isProductionFn(), (config) => {
    config.plugin('bar').use(Webpackbar, [
      {
        name: 'TOOLKIT',
        color: 'blue',
      },
    ]);
  });
}
module.exports = {
  createWebpackBar,
};
