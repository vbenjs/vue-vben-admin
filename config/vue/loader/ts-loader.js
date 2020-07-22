const resolve = require('../../../build/getCwdPath');

function configTsLoader(config) {
  config.module.rule('ts').exclude.add(resolve('node_modules')).end();
  config.module.rule('tsx').exclude.add(resolve('node_modules')).end();
}
module.exports = {
  configTsLoader,
};
