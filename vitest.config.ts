import { resolve } from 'node:path';

import Vue from '@vitejs/plugin-vue';
import VueJsx from '@vitejs/plugin-vue-jsx';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [Vue(), VueJsx()],
  resolve: {
    alias: {
      '#': resolve(__dirname, 'apps/web-antd/src'),
    },
  },
  test: {
    environment: 'happy-dom',
    exclude: [
      ...configDefaults.exclude,
      '**/.worktrees/**',
      '**/apps/server/**',
      '**/e2e/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/node_modules/**',
      '**/{stylelint,eslint}.config.*',
      '.prettierrc.mjs',
    ],
  },
});
