const { sh } = require('tasksfile');
const yargs = require('yargs');
const mkdirp = require('mkdirp');
const { buildConfig } = require('./build-conf');
const { updateVersion } = require('./update-version');
const { buildZip } = require('./build-zip');
const { successTip, errorTip, isReportModeFn } = require('../utils');
const resolve = require('../getCwdPath');
const { selectBuildModule } = require('./selectBuildModule');
const { getEnvConfig } = require('../getEnvConfig');

async function build(v) {
  const argvList = yargs.argv._;
  try {
    if (!argvList.includes('no-uv')) {
      // await updateVersion();
    }

    let command = `cross-env  --max_old_space_size=4096 vue-cli-service build --no-clean --mode=production ${argvList.join(
      ' '
    )} `;
    // 多页模式

    // const env = getEnvConfig('VUE_APP');
    // const isSpa = env.VUE_APP_MODE === 'SPA';
    // let str = '';
    // if (!isSpa) {
    //   const _module = yargs.argv.module;
    //   if (_module) {
    //     command += ` --module=${_module}`;
    //     str = _module;
    //   } else {
    //     const moduleStr = await selectBuildModule('请选择需要打包的模块');
    //     str = moduleStr;
    //     command += ` --module=${moduleStr}`;
    //   }
    // }
    // 更新配置文件
    if (!argvList.includes('no-conf')) {
      await buildConfig();
    }
    await sh(command, {
      async: true,
      nopipe: true,
    });
    if (!isReportModeFn()) {
      const zipPath = '.local/output/dist/';
      mkdirp.sync(resolve(zipPath));
      buildZip('dist/', zipPath);
    }
    successTip('Packaged successfully!');
  } catch (error) {
    errorTip('Packaging failed', error);
  }
}

build();
