import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    base: './',
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
        '/oauth2/token': {
          target: 'http://172.16.10.104:18000',
          changeOrigin: true,
        },
        '/logout': {
          target: 'http://172.16.10.104:18000',
          changeOrigin: true,
        },
        '/hd-api': {
          target: 'http://172.16.10.104:18000',
          changeOrigin: true,
          ws: true,
        },
        '/hd-office': {
          target: 'http://172.16.0.28:808',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/hd-office/, '/'),
        },
      },
    },
  },
});
