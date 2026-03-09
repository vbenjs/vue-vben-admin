import { colors, consola } from '@vben/node-utils';

import { cac } from 'cac';

import { version } from '../package.json';
import { defineCheckCircularCommand } from './check-circular';
import { defineDepcheckCommand } from './check-dep';
import { defineCodeWorkspaceCommand } from './code-workspace';
import { defineLintCommand } from './lint';
import { definePubLintCommand } from './publint';

// 命令描述
const COMMAND_DESCRIPTIONS = {
  'check-circular': 'Check for circular dependencies',
  'check-dep': 'Check for unused dependencies',
  'code-workspace': 'Manage VS Code workspace settings',
  lint: 'Run linting on the project',
  publint: 'Check package.json files for publishing standards',
} as const;

/**
 * Initialize and run the CLI
 */
async function main(): Promise<void> {
  try {
    const vsh = cac('vsh');

    // Register commands
    defineLintCommand(vsh);
    definePubLintCommand(vsh);
    defineCodeWorkspaceCommand(vsh);
    defineCheckCircularCommand(vsh);
    defineDepcheckCommand(vsh);

    // Set up CLI
    vsh.usage('vsh <command> [options]');
    vsh.help();
    vsh.version(version);

    // Parse arguments without auto-running to detect unknown commands
    // Note: cac v7 removed EventEmitter; use matchedCommand after parse instead
    vsh.parse(undefined, { run: false });

    if (!vsh.matchedCommand && vsh.args.length > 0) {
      const unknownCmd = String(vsh.args[0]);
      consola.error(
        colors.red(`Invalid command: ${unknownCmd}`),
        '\n',
        colors.yellow('Available commands:'),
        '\n',
        Object.entries(COMMAND_DESCRIPTIONS)
          .map(([name, desc]) => `  ${colors.cyan(name)} - ${desc}`)
          .join('\n'),
      );
      process.exit(1);
    }

    await vsh.runMatchedCommand();
  } catch (error) {
    consola.error(
      colors.red('An unexpected error occurred:'),
      '\n',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

// Run the CLI
main().catch((error) => {
  consola.error(
    colors.red('Failed to start CLI:'),
    '\n',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
