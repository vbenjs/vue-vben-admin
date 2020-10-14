// #!/usr/bin/env node

// import { sh } from 'tasksfile';

import { argv } from 'yargs';
import { runBuildConfig } from './buildConf';
import { runUpdateHtml } from './updateHtml';
import { errorConsole, successConsole, run } from '../utils';

export const runBuild = async () => {
  try {
    const argvList = argv._;
    // let cmd = `cross-env NODE_ENV=production vite build`;
    await run('cross-env', ['NODE_ENV=production', 'vite', 'build']);
    // await sh(cmd, {
    //   async: true,
    //   nopipe: true,
    // });

    // Generate configuration file
    if (!argvList.includes('no-conf')) {
      await runBuildConfig();
    }
    await runUpdateHtml();
    successConsole('Vite Build successfully!');
  } catch (error) {
    errorConsole('Vite Build Error\n' + error);
    process.exit(1);
  }
};
