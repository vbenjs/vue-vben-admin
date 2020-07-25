// 是否需要更新依赖，防止package.json更新了依赖，其他人获取代码后没有install
// 这里需要手动改动
const NEED_INSTALL = false;

module.exports = NEED_INSTALL;

const shelljs = require('shelljs');
const { exec } = shelljs;

if (NEED_INSTALL) {
  if (exec('yarn install').code === 0) {
    const needInstall = require('./preserve.js');
    if (needInstall) {
      const fs = require('fs-extra');
      let jsText = fs.readFileSync(require.resolve('./preserve.js'), 'utf-8');
      jsText = jsText.replace(/const NEED_INSTALL = true;/, 'const NEED_INSTALL = false;');
      fs.writeFileSync(require.resolve('./preserve.js'), jsText);
    }
  }
}
