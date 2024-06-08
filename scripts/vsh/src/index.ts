import { colors, consola } from '@vben/node-utils';

import { cac } from 'cac';

import { defineCheckCircularCommand } from './check-circular';
import { defineDepcheckCommand } from './check-dep';
import { defineCleanCommand } from './clean';
import { defineCodeWorkspaceCommand } from './code-workspace';
import { defineLintCommand } from './lint';
import { definePubLintCommand } from './publint';

try {
  const vsh = cac('vsh');

  // vsh lint
  defineLintCommand(vsh);

  // vsh publint
  definePubLintCommand(vsh);

  // vsh clean
  defineCleanCommand(vsh);

  // vsh code-workspace
  defineCodeWorkspaceCommand(vsh);

  // vsh check-circular
  defineCheckCircularCommand(vsh);

  // vsh check-dep
  defineDepcheckCommand(vsh);

  // Invalid command
  vsh.on('command:*', () => {
    consola.error(colors.red('Invalid command!'));
    process.exit(1);
  });

  vsh.usage('vsh');
  vsh.help();
  vsh.parse();
} catch (error) {
  consola.error(error);
  process.exit(1);
}
