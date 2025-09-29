import { defineConfig } from '@vben/vite-config';

import ElementPlus from 'unplugin-element-plus/vite';

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
            // mock代理目标地址
            target: 'http://localhost:8088/',
            ws: true,
          },
          // '/auth': {
          //   changeOrigin: true,
          //   // mock代理目标地址
          //   target: 'http://localhost:8088/',
          //   ws: true,
          // },
        },
      },
    },
  };
});
