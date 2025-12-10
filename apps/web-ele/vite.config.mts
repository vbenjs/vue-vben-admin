import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

const _filename = fileURLToPath(import.meta.url);
const _dirname = resolve(_filename, '..');

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        ElementPlus({
          format: 'esm',
        }),
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 鉴权系统线上地址
            target: 'http://117.72.15.74:7444/api',
            ws: true,
          },
        },
      },

      // 添加 resolve.alias 配置
      resolve: {
        alias: {
          '@': resolve(_dirname, 'src'),
          '#': resolve(_dirname, 'src'),
          '~': resolve(_dirname, 'node_modules'),
          // 如果需要，可以添加更多别名
          components: resolve(_dirname, 'src/components'),
          views: resolve(_dirname, 'src/views'),
          api: resolve(_dirname, 'src/api'),
          utils: resolve(_dirname, 'src/utils'),
        },
        // 确保扩展名正确解析
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      },
    },
  };
});
