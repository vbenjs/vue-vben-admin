const { selectBuildModule } = require('./selectBuildModule');
const { getEnvConfig } = require('../getEnvConfig');
const runjs = require('runjs');
const yargs = require('yargs');
const { run } = runjs;
async function devServer() {
  const argvList = yargs.argv._;

  let command = `cross-env --max_old_space_size=4096 vue-cli-service serve --mode development ${argvList.join(
    ' '
  )} `;

  // const env = getEnvConfig('VUE_APP');
  // const isSpa = env.VUE_APP_MODE === 'SPA';
  // if (!isSpa) {
  //   const _module = yargs.argv.module;
  //   if (_module) {
  //     command += ` --module=${_module}`;
  //   } else {
  //     const moduleStr = await selectBuildModule('请选择要运行的模块');
  //     command += ` --module=${moduleStr}`;
  //   }
  // }
  await run(command, {
    async: true,
    stdio: 'inherit',
  });
}
devServer();
