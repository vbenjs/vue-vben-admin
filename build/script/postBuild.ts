// #!/usr/bin/env node

import { argv } from 'yargs';
import { runBuildConfig } from './buildConf';
import chalk from 'chalk';

import pkg from '../../package.json';

export const runBuild = async () => {
  try {
    const argvList = argv._;

    // Generate configuration file
    if (!argvList.includes('no-conf')) {
      await runBuildConfig();
    }
    console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
    process.exit(1);
  }
};
runBuild();
