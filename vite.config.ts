import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
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
      host: '127.0.0.1',
      port: 3100,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:4200',
          changeOrigin: true,
          ws: true,
          // only https
          // secure: false
        },
        '/oauth2': {
          target: 'http://127.0.0.1:4200',
          changeOrigin: true,
          ws: true,
        },
      },
    },
  },
});
