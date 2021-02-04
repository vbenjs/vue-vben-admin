// #!/usr/bin/env node

import { argv } from 'yargs';
import { runBuildConfig } from './buildConf';
import chalk from 'chalk';

export const runBuild = async () => {
  try {
    const argvList = argv._;

    // Generate configuration file
    if (!argvList.includes('no-conf')) {
      await runBuildConfig();
    }
    console.log(chalk.green.bold('✨ vite build successfully!\n'));
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
    process.exit(1);
  }
};
runBuild();
