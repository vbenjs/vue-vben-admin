import type { PluginOption } from 'vite';

import type { CommonPluginOptions } from '../typing';

import fs from 'node:fs';

import electron from 'vite-plugin-electron/simple';

export const viteElectronPlugin = (
  options: CommonPluginOptions,
): PluginOption => {
  fs.rmSync('dist-electron', { force: true, recursive: true });

  const isServe = !options.isBuild;
  const isBuild = options.isBuild;
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  return electron({
    main: {
      entry: 'electron/main.ts',
      vite: {
        build: {
          minify: isBuild,
          outDir: 'dist-electron/main',
          sourcemap,
        },
      },
    },
    preload: {
      input: 'electron/preload.ts',
      vite: {
        build: {
          minify: isBuild,
          outDir: 'dist-electron/preload',
          sourcemap: sourcemap ? 'inline' : undefined, // #332
        },
      },
    },
    renderer: {},
  });
};
