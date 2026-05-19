import type { CAC } from 'cac';

import { execaCommand } from '@vben/node-utils';

interface LintCommandOptions {
  /**
   * Format lint problem.
   */
  format?: boolean;
  /**
   * Number of threads for oxfmt and oxlint (default: 2).
   */
  threads?: number;
}

async function runLint({ format, threads }: LintCommandOptions) {
  // process.env.FORCE_COLOR = '3';
  const threadsArg = threads ? ` --threads=${threads}` : ` --threads=2`;

  if (format) {
    await execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache --fix`, {
      stdio: 'inherit',
    });
    await execaCommand(`oxfmt${threadsArg}`, {
      stdio: 'inherit',
    });
    await execaCommand(`oxlint --fix${threadsArg}`, {
      stdio: 'inherit',
    });
    await execaCommand(`eslint . --cache --fix`, {
      stdio: 'inherit',
    });
    return;
  }
  const controller = new AbortController();
  const { signal: cancelSignal } = controller;

  const commands = [
    execaCommand(`oxfmt --check${threadsArg}`, {
      cancelSignal,
      stdio: 'inherit',
    }),
    execaCommand(`oxlint${threadsArg}`, { cancelSignal, stdio: 'inherit' }),
    execaCommand(`eslint . --cache`, { cancelSignal, stdio: 'inherit' }),
    execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache`, {
      cancelSignal,
      stdio: 'inherit',
    }),
  ];

  try {
    await Promise.all(commands);
  } catch (error) {
    controller.abort();
    throw error;
  }
}

function defineLintCommand(cac: CAC) {
  cac
    .command('lint')
    .usage('Batch execute project lint check.')
    .option('--format', 'Format lint problem.')
    .option('--threads <count>', 'Number of threads for oxfmt and oxlint.')
    .action(runLint);
}

export { defineLintCommand };
