import Vue from 'unplugin-vue/rolldown';

import { defineConfig } from 'tsdown';

export default defineConfig({
  clean: true,
  deps: {
    skipNodeModulesBundle: true,
  },
  dts: {
    vue: true,
  },
  entry: ['src/index.ts'],
  format: ['esm'],
  outExtensions: () => ({
    dts: '.d.ts',
    js: '.mjs',
  }),
  platform: 'neutral',
  plugins: [Vue({ isProduction: true })],
  unbundle: true,
});
