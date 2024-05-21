import { defineConfig } from '@vben/vite-config';

export default defineConfig({
  appcation: {
    compress: false,
    compressTypes: ['brotli', 'gzip'],
    importmap: false,
    importmapOptions: {
      // 通过 Importmap CDN 方式引入,
      // 目前只有esm.sh源兼容性好一点，jspm.io对于 esm 入口要求高
      defaultProvider: 'esm.sh',
      importmap: [
        { name: 'vue' },
        { name: 'pinia' },
        { name: 'vue-router' },
        { name: 'vue-i18n' },
        { name: 'dayjs' },
        { name: 'vue-demi' },
      ],
    },
    visualizer: true,
  },
  vite: {
    server: {
      proxy: {
        '/vben-api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/vben-api/, ''),
          target: 'http://localhost:3000',
          ws: true,
        },
      },
    },
  },
});
