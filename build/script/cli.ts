#!/usr/bin/env node

import chalk from 'chalk';
import { argv } from 'yargs';

import { runChangeLog } from './changelog';
import { runPostInstall } from './postinstall';
import { runPreview } from './preview';
// import { runPreserve } from './preserve';
import { runBuild } from './build';

const task = (argv._ || [])[0];

console.log('Run Task: ' + chalk.cyan(task));

switch (task) {
  // change log
  case 'log':
    runChangeLog();
    break;

  case 'build':
    runBuild();
    break;

  // case 'preserve':
  //   runPreserve();
  //   break;

  case 'postinstall':
    runPostInstall();
    break;

  case 'preview':
    runPreview();
    break;

  // TODO
  case 'gzip':
    break;
  default:
    break;
}

export default {};
