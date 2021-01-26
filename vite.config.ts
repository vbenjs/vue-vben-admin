import type { UserConfig, ConfigEnv } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';

import { loadEnv } from 'vite';

import { modifyVars } from './build/config/lessModifyVars';
import { createProxy } from './build/vite/proxy';

import { wrapperEnv } from './build/utils';

import { createVitePlugins } from './build/vite/plugin';

const pkg = require('./package.json');

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir);
}

const root: string = process.cwd();

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_LEGACY } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    alias: {
      '/@/': `${pathResolve('src')}/`,
    },
    server: {
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
      hmr: {
        overlay: true,
      },
    },
    build: {
      polyfillDynamicImport: VITE_LEGACY,
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: VITE_DROP_CONSOLE,
        },
      },
    },
    define: {
      __VERSION__: pkg.version,
      // setting vue-i18-next
      // Suppress warning
      __VUE_I18N_LEGACY_API__: false,
      __VUE_I18N_FULL_INSTALL__: false,
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // reference:  Avoid repeated references
            hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
            ...modifyVars,
          },
          javascriptEnabled: true,
        },
      },
    },

    plugins: [
      vue(),
      vueJsx(),
      ...(VITE_LEGACY && isBuild ? [legacy()] : []),
      ...createVitePlugins(viteEnv, isBuild, mode),
    ],

    optimizeDeps: {
      include: [
        'moment',
        '@ant-design/icons-vue',
        'echarts/map/js/china',
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'resize-observer-polyfill',
      ],
    },
  };
};
