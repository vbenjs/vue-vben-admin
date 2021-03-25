import type { UserConfig, ConfigEnv } from 'vite';

import { loadEnv } from 'vite';
import { resolve } from 'path';

import { generateModifyVars } from './build/config/themeConfig';
import { createProxy } from './build/vite/proxy';
import { createAlias } from './build/vite/alias';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: createAlias([
        // /@/xxxx => src/xxxx
        ['/@/', 'src'],
        // /#/xxxx => types/xxxx
        ['/#/', 'types'],
      ]),
    },
    server: {
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
      hmr: {
        overlay: true,
      },
    },

    build: {
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      brotliSize: false,
      chunkSizeWarningLimit: 1200,
    },
    define: {
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
            // Used for global import to avoid the need to import each style file separately
            // reference:  Avoid repeated references
            hack: `true; @import (reference) "${resolve('src/design/config.less')}";`,
            ...generateModifyVars(),
          },
          javascriptEnabled: true,
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'moment/dist/locale/zh-cn',
        'ant-design-vue/es/locale/en_US',
        'moment/dist/locale/eu',
      ],
      exclude: ['vue-demi'],
    },
  };
};
