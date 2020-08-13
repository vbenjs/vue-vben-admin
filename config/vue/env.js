function configEnv() {
  // version
  process.env.VUE_APP_VERSION = require('../../package.json').version;
  // build time
  process.env.VUE_APP_BUILD_TIME = require('moment')().format('YYYY-MM-DD HH:mm:ss');
  process.env.VUE_APP_BUILD_SHORT_TIME = require('moment')().format('MMDDHHmmss');
}
module.exports = configEnv;
