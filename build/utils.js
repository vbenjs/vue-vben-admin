const { networkInterfaces, NetworkInterfaceInfo } = require('os');

const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');

const spinner = ora();

/**
 * @description: success tip
 * @Date: 2020-03-16 13:06:12
 */
function successTip(msg) {
  spinner.succeed(
    console.log(
      chalk.blue.bold('****************  ') +
        chalk.green.bold(msg) +
        chalk.blue.bold('  ****************') +
        '. 🎉 🎉 🎉 🎉\n'
    )
  );
}

/**
 * @description: error tip
 * @Date: 2020-03-16 13:06:12
 */
function errorTip(msg, err) {
  spinner.fail(
    console.error('\n') +
      console.error(msg + '\n') +
      console.error(chalk.magenta('The specific error message is as follows \n')) +
      chalk.red(err) +
      '. 😭\n'
  );
  process.exit(1);
}
function inquirerPrompt(question) {
  return inquirer.prompt(question);
}
/**
 * @description: get env
 * @Date: 2020-06-07 22:32:25
 */
function getEnvFn() {
  return process.env;
}
/**
 * @description: get mode
 * @Date: 2020-06-07 22:32:56
 */
function getModeFn() {
  return getEnvFn().NODE_ENV;
}
/**
 * @description: Whether it is a production mode
 * @Date: 2020-06-07 22:33:35
 */
function isProductionFn() {
  return getModeFn() === 'production';
}
/**
 * @description: Whether to develop mode
 * @Date: 2020-06-07 22:34:11
 */
function isDevFn() {
  return getModeFn() === 'development';
}

/**
 * @description: Whether to support ie
 *
 * @Date: 2020-06-15 11:06:12
 */
function supportIeFn() {
  return process.env.VUE_APP_SUPPORT_IE === 'TRUE';
}
/**
 * @description: Whether it is report mode
 * @Date: 2020-06-15 11:06:18
 */
function isReportModeFn() {
  return !!process.env.REPORT;
}

/**
 * @description: Get local ip
 * @Date: 2020-06-15 11:06:35
 */
function getIPAddress() {
  let interfaces = networkInterfaces();
  for (let devName in interfaces) {
    let iFace = interfaces[devName];
    for (let i = 0; i < iFace.length; i++) {
      let alias = iFace[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }

  return '';
}

module.exports = {
  getEnvFn,
  getModeFn,
  isProductionFn,
  isDevFn,
  errorTip,
  successTip,
  inquirerPrompt,
  supportIeFn,
  isReportModeFn,
  getIPAddress,
};
