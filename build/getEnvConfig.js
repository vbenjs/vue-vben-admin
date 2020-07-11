const resolve = require('./getCwdPath');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const { readFileSync } = fs;

/**
 * @description: 获取环境变量
 * @Date: 2020-06-16 17:09:07
 */
function getEnvConfig(match = 'GLOB_', confFiles = ['.env', '.env.production']) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(readFileSync(resolve(item)));

      envConfig = { ...envConfig, ...env };
    } catch (error) {}
  });
  Object.keys(envConfig).forEach((key) => {
    const reg = new RegExp(`^(${match})`);
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}
/**
 * @description: 获取多页标题
 * @Date: 2020-06-16 17:09:00
 */
function getMpaTitles() {
  const { GLOB_APP_TITLE_MPA } = getEnvConfig('GLOB_', ['.env']);
  try {
    const titleObj = JSON.parse(GLOB_APP_TITLE_MPA);
    return titleObj;
  } catch (error) {
    return {};
  }
}

module.exports = {
  getEnvConfig,
  getMpaTitles,
};
