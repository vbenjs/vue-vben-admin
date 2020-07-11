#!/usr/bin/env node

const resolve = require('../getCwdPath');
const { successTip, errorTip } = require('../utils');

const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const { getEnvConfig, getMpaTitles } = require('../getEnvConfig');
const { writeFileSync } = fs;
const getShortName = (env) => {
  return `__PRODUCTION__${env.GLOB_APP_SHORT_NAME || '__APP'}__CONF__`.toUpperCase();
};
const pages = getMpaTitles();
const pageKeys = Object.keys(pages);
const MPA_END_REG = /(?<=_MPA)$/;
/**
 * @description: 获取多页文件配置
 * @Date: 2020-06-16 16:49:34
 */
function getMpaConfig(config) {
  const formatConfig = {};
  const result = {};
  try {
    Object.keys(config).forEach((key) => {
      if (MPA_END_REG.test(key)) {
        formatConfig[key] = JSON.parse(config[key]);
      } else {
        formatConfig[key] = config[key];
      }
    });
    pageKeys.forEach((page) => {
      const pageConfigItem = {};
      Object.keys(formatConfig).forEach((key) => {
        if (!MPA_END_REG.test(key)) {
          const mpaKey = `${key}_MPA`;
          pageConfigItem[key] = formatConfig[key];
          if (formatConfig[mpaKey]) {
            pageConfigItem[key] = formatConfig[mpaKey][page] || formatConfig[key];
          }
        }
      });
      result[page] = pageConfigItem;
    });
    return result;
  } catch (error) {
    console.error(error);
    return [];
  }
}
/**
 * @description: 创建配置文件
 * @Date: 2020-06-16 17:29:58
 */
function createConfig({ configName, config, configFileName = 'window-glob.js' } = {}) {
  try {
    const configStr = `window.${configName}=${JSON.stringify(config)};`;
    mkdirp.sync(resolve('dist'), {});
    writeFileSync(resolve(`dist/${configFileName}`), configStr);
    successTip('The configuration file is packaged successfully!');
  } catch (error) {
    errorTip('Configuration file configuration file failed to package', error);
  }
}
/**
 * @description:  打包配置文件
 * @Date: 2020-03-18 09:27:17
 */
async function buildConfig(moduleStr = '') {
  const config = getEnvConfig();

  // 是否为单页应用
  // const appConfig = getEnvConfig('VUE_APP');
  // const isSpa = appConfig.VUE_APP_MODE === 'SPA';

  let CONFIG_NAME;
  let CONFIG_OBJ = [];
  // // 单页应用配置文件抽取
  // if (isSpa) {
  Object.keys(config).forEach((key) => {
    if (MPA_END_REG.test(key)) {
      Reflect.deleteProperty(config, key);
    }
  });
  CONFIG_NAME = getShortName(config);
  // }
  // else {
  //   // 多页应用配置文件抽取
  //   CONFIG_OBJ = getMpaConfig(config);
  // }

  // 打包成dist
  // if (isSpa) {
  createConfig({ config, configName: CONFIG_NAME });
  // }
  // else {
  //   // 多页
  //   pageKeys.forEach((key) => {
  //     if (moduleStr && !moduleStr.split(',').includes(key)) {
  //       return;
  //     }
  //     const _configName = getShortName({
  //       GLOB_APP_SHORT_NAME: `${config.GLOB_APP_SHORT_NAME}`,
  //     });

  //     const _config = CONFIG_OBJ[key];
  //     createConfig({
  //       config: _config,
  //       configName: _configName,
  //       configFileName: `window-glob-${key}.js`,
  //     });
  //   });
  // }
}
module.exports = { buildConfig, getEnvConfig };
