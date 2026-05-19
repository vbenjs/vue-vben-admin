import type { CAC } from 'cac';

import { execaCommand } from '@vben/node-utils';

interface LintCommandOptions {
  /**
   * Format lint problem.
   */
  format?: boolean;
  /**
   * Number of threads for oxlint (default: system CPU count).
   */
  threads?: number;
}

async function runLint({ format, threads }: LintCommandOptions) {
  // process.env.FORCE_COLOR = '3';
  const threadsArg = threads ? ` --threads=${threads}` : '';

  if (format) {
    await execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache --fix`, {
      stdio: 'inherit',
    });
    await execaCommand(`oxfmt`, {
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
  await Promise.all([
    execaCommand(`oxfmt --check`, {
      stdio: 'inherit',
    }),
    execaCommand(`oxlint${threadsArg}`, {
      stdio: 'inherit',
    }),
    execaCommand(`eslint . --cache`, {
      stdio: 'inherit',
    }),
    execaCommand(`stylelint "**/*.{vue,css,less,scss}" --cache`, {
      stdio: 'inherit',
    }),
  ]);
}

function defineLintCommand(cac: CAC) {
  cac
    .command('lint')
    .usage('Batch execute project lint check.')
    .option('--format', 'Format lint problem.')
    .option('--threads <count>', 'Number of threads for oxlint.')
    .action(runLint);
}

export { defineLintCommand };
