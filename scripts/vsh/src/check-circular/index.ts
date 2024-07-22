import type { CAC } from 'cac';

import { extname } from 'node:path';

import { getStagedFiles } from '@vben/node-utils';

import { circularDepsDetect, printCircles } from 'circular-dependency-scanner';

const IGNORE_DIR = [
  'dist',
  '.turbo',
  'output',
  '.cache',
  'scripts',
  'internal',
  'packages/effects/request/src/',
  'packages/@core/ui-kit/menu-ui/src/',
].join(',');

const IGNORE = [`**/{${IGNORE_DIR}}/**`];

interface CommandOptions {
  staged: boolean;
  verbose: boolean;
}

async function checkCircular({ staged, verbose }: CommandOptions) {
  const results = await circularDepsDetect({
    absolute: staged,
    cwd: process.cwd(),
    ignore: IGNORE,
  });

  if (staged) {
    let files = await getStagedFiles();

    const allowedExtensions = new Set([
      '.cjs',
      '.js',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]);

    // 过滤文件列表
    files = files.filter((file) => allowedExtensions.has(extname(file)));

    const circularFiles: string[][] = [];

    for (const file of files) {
      for (const result of results) {
        const resultFiles = result.flat();
        if (resultFiles.includes(file)) {
          circularFiles.push(result);
        }
      }
    }
    verbose && printCircles(circularFiles);
  } else {
    verbose && printCircles(results);
  }
}

function defineCheckCircularCommand(cac: CAC) {
  cac
    .command('check-circular')
    .option(
      '--staged',
      'Whether it is the staged commit mode, in which mode, if there is a circular dependency, an alarm will be given.',
    )
    .usage(`Analysis of project circular dependencies.`)
    .action(async ({ staged }) => {
      await checkCircular({ staged, verbose: true });
    });
}

export { defineCheckCircularCommand };
