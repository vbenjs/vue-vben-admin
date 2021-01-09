// #!/usr/bin/env node

import { argv } from 'yargs';
import { runBuildConfig } from './buildConf';
import { errorConsole, successConsole } from '../utils';

export const runBuild = async () => {
  try {
    const argvList = argv._;

    // Generate configuration file
    if (!argvList.includes('no-conf')) {
      await runBuildConfig();
    }
    successConsole('Vite Build successfully!');
  } catch (error) {
    errorConsole('Vite Build Error\n' + error);
    process.exit(1);
  }
};
runBuild();
