function configEnv() {
  // version
  process.env.VUE_APP_VERSION = require('../../package.json').version;
  // build time
  process.env.VUE_APP_BUILD_TIME = require('moment')().format('YYYY-M-D HH:mm:ss');
}
module.exports = configEnv;
