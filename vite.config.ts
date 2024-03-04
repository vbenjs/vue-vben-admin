import { defineConfig, loadEnv } from 'vite';

import { defineApplicationConfig } from '@vben/vite-config';

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineApplicationConfig({
    overrides: {
      optimizeDeps: {
        include: [
          'echarts/core',
          'echarts/charts',
          'echarts/components',
          'echarts/renderers',
          'qrcode',
          '@iconify/iconify',
          'ant-design-vue/es/locale/zh_CN',
          'ant-design-vue/es/locale/en_US',
        ],
      },
      server: {
        proxy: {
          '/basic-api': {
            target: env.VITE_APP_PROXY_URL || 'http://localhost:3000',
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
            // only https
            // secure: false
          },
          '/upload': {
            target: 'http://localhost:3300/upload',
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
          },
        },
        warmup: {
          clientFiles: ['./index.html', './src/{views,components}/*'],
        },
      },
    },
  })({ command, mode });
});


