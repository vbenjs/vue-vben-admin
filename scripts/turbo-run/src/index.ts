import { consola } from '@vben/node-utils';

import { cac } from 'cac';

import { run } from './run';

try {
  const turboRun = cac('turbo-run');

  turboRun
    .command('[script]')
    .usage(`Run turbo interactively.`)
    .action(async (command: string) => {
      run({ command });
    });

  turboRun.usage('turbo-run');
  turboRun.help();
  turboRun.parse();
} catch (error) {
  consola.error(error);
  process.exit(1);
}
