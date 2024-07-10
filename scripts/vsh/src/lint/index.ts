import type { CAC } from 'cac';

import { $ } from '@vben/node-utils';

interface LintCommandOptions {
  /**
   * Format lint problem.
   */
  format?: boolean;
}

async function runLint({ format }: LintCommandOptions) {
  process.env.FORCE_COLOR = '3';
  if (format) {
    await $`stylelint "**/*.{vue,css,less.scss}" --cache --fix`;
    await $`eslint . --cache --fix`;
    await $`prettier . --write --cache --log-level warn`;
    return;
  }

  await Promise.all([
    $`eslint . --cache`,
    // $`ls-lint`,
    $`prettier . --ignore-unknown --check --cache`,
    $`stylelint "**/*.{vue,css,less.scss}" --cache`,
  ]);
}

function defineLintCommand(cac: CAC) {
  cac
    .command('lint')
    .usage('Batch execute project lint check.')
    .option('--format', 'Format lint problem.')
    .action(runLint);
}

export { defineLintCommand };
