import { cp, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'tsdown';

const rootDir = dirname(fileURLToPath(import.meta.url));
const loadingAssets = ['default-loading-antd.html', 'default-loading.html'];

export default defineConfig({
  clean: true,
  deps: {
    neverBundle: ['@vben/node-utils'],
    skipNodeModulesBundle: true,
  },
  dts: {
    resolver: 'tsc',
  },
  entry: ['src/index.ts'],
  format: ['esm'],
  hooks: {
    'build:done': async (context) => {
      const outDir = context.options.outDir;
      if (!outDir) {
        return;
      }

      await mkdir(outDir, { recursive: true });

      for (const file of loadingAssets) {
        await cp(
          join(rootDir, 'src/plugins/inject-app-loading', file),
          join(outDir, file),
        );
      }
    },
  },
  outExtensions: () => ({
    dts: '.d.ts',
  }),
});
