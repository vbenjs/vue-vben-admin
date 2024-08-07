import { defineConfig } from '@vben/vite-config';

import Inspector from 'vite-plugin-vue-inspector';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [Inspector()],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
      },
    },
  };
});
