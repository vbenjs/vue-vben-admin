import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://10.10.10.188:8070/api',
            ws: true,
          },
          '/static': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/static/, ''),
            // mock代理目标地址
            target: 'http://localhost:8070/static',
            ws: true,
          },
        },
      },
    },
  };
});
