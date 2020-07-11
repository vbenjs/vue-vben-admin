/**
 * 使用cnpm 来安装image-webpack-loader
 */
// const shelljs = require('shelljs');
// const { exec } = shelljs;

// /**
//  * @description: 判断是否装了cnpm
//  * @Date: 2020-06-10 13:46:40
//  */
// function isInstallCnpm() {
//   return new Promise((resolve) => {
//     const runSuccess = exec('cnpm -v').code === 0;
//     resolve(runSuccess);
//   });
// }
// /**
//  * @description: 尝试安装cnpm
//  * @Date: 2020-06-10 13:47:05
//  */
// function tryInstallCnpm() {
//   return new Promise((resolve) => {
//     if (exec('npm install -g cnpm --registry=https://registry.npm.taobao.org').code === 0) {
//       resolve();
//     } else {
//       shell.echo('请安装 cnpm');
//       shell.exit(1);
//     }
//   });
// }
// /**
//  * @description: 安装插件
//  * @Date: 2020-06-10 13:46:47
//  */
// async function installImageWebpack() {
//   const installCnpm = await isInstallCnpm();

//   if (!installCnpm) {
//     await tryInstallCnpm();
//     installImageWebpack();
//     return;
//   }
//   if (exec('cnpm install image-webpack-loader -D').code !== 0) {
//     //执行npm run build 命令
//     shell.echo('请安装 cnpm');
//     shell.exit(1);
//   }
// }

// /**
//  * @description: 使git对文件名大小写敏感
//  * @Date: 2020-06-11 11:07:04
//  */
// function ignoreCaseGit() {
//   exec('git config core.ignorecase false ');
// }
// installImageWebpack();

// ignoreCaseGit();
