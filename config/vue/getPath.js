const resolve = require('../../build/getCwdPath');
const { getEnvFn } = require('../../build/utils');

const ENV = getEnvFn();
function getPublicPath() {
  return ENV.VUE_APP_PUBLIC_PATH;
}
function getAssetsPath(dir) {
  return resolve(ENV.VUE_APP_ASSETS_DIR + dir);
}

module.exports = {
  getPublicPath,
  getAssetsPath,
};
