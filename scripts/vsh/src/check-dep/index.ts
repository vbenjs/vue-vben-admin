import type { CAC } from 'cac';

import { getPackages } from '@vben/node-utils';

import depcheck from 'depcheck';

async function runDepcheck() {
  const { packages } = await getPackages();
  await Promise.all(
    packages.map(async (pkg) => {
      if (
        [
          '@vben/commitlint-config',
          '@vben/eslint-config',
          '@vben/lint-staged-config',
          '@vben/node-utils',
          '@vben/prettier-config',
          '@vben/stylelint-config',
          '@vben/tailwind-config',
          '@vben/tsconfig',
          '@vben/vite-config',
          '@vben/vite-config',
          '@vben/vsh',
        ].includes(pkg.packageJson.name)
      ) {
        return;
      }

      const unused = await depcheck(pkg.dir, {
        ignoreMatches: [
          'vite',
          'vitest',
          'unbuild',
          '@vben/tsconfig',
          '@vben/vite-config',
          '@vben/tailwind-config',
          '@types/*',
          '@vben-core/design',
        ],
        ignorePatterns: ['dist', 'node_modules', 'public'],
      });

      if (
        Object.keys(unused.missing).length === 0 &&
        unused.dependencies.length === 0 &&
        unused.devDependencies.length === 0
      ) {
        return;
      }
      console.error(
        '\n',
        pkg.packageJson.name,
        '\n missing:',
        unused.missing,
        '\n dependencies:',
        unused.dependencies,
        '\n devDependencies:',
        unused.devDependencies,
      );
    }),
  );
}

function defineDepcheckCommand(cac: CAC) {
  cac
    .command('check-dep')
    .usage(`Analysis of project circular dependencies.`)
    .action(async () => {
      await runDepcheck();
    });
}

export { defineDepcheckCommand };
