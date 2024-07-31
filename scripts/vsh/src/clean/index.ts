import type { CAC } from 'cac';

import { join } from 'node:path';

import { colors, getPackages, rimraf, spinner } from '@vben/node-utils';

const CLEAN_DIRS = ['dist', 'node_modules', '.turbo'];

interface CleanCommandOptions {
  /**
   * Whether to delete the project pnpm-lock.yaml file.
   * @default true
   */
  delLock?: boolean;
  /**
   * Files that need to be cleared.
   */
  dirs?: string[];
  /**
   * recursive clear.
   * @default true
   */
  recursive?: boolean;
}

async function runClean({
  delLock = false,
  dirs = [],
  recursive,
}: CleanCommandOptions) {
  const cleanDirs = dirs.length === 0 ? CLEAN_DIRS : dirs;

  const cleanDirsText = JSON.stringify(cleanDirs);

  spinner(
    {
      successText: colors.green(`clean up all \`${cleanDirsText}\` success.`),
      title: `${colors.dim(cleanDirsText)} cleaning in progress...`,
    },
    async () => {
      await clean({ delLock, dirs: cleanDirs, recursive });
    },
  );
}

async function clean({ delLock, dirs = [], recursive }: CleanCommandOptions) {
  const { packages, rootDir } = await getPackages();

  // Delete the project pnpm-lock.yaml file
  if (delLock) {
    await rimraf(join(rootDir, 'pnpm-lock.yaml'));
  }

  // Recursively delete the specified folders under all package directories
  if (recursive) {
    await Promise.all(
      packages.map((pkg) => {
        const pkgRoot = dirs.map((dir) => join(pkg.dir, dir));
        return rimraf(pkgRoot, { preserveRoot: true });
      }),
    );
  }

  // Only delete the specified folders in the root directory
  await Promise.all(
    dirs.map((dir) => rimraf(join(process.cwd(), dir), { preserveRoot: true })),
  );
}

function defineCleanCommand(cac: CAC) {
  cac
    .command('clean [dirs...]')
    .usage(
      `Delete all ['dist', 'node_modules', '.turbo'] directories under the project.`,
    )
    .option('-r,--recursive', 'Recursively clean all packages in a monorepo.', {
      default: true,
    })
    .option('--del-lock', 'Delete the project pnpm-lock.yaml file.', {
      default: true,
    })
    .action(
      async (dirs, { delLock, recursive }) =>
        await runClean({ delLock, dirs, recursive }),
    );
}

export { defineCleanCommand };
