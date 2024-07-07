import { defineConfig } from '@vben/vite-config';

export default defineConfig({
  application: ({ mode }) => {
    return {
      compress: false,
      compressTypes: ['brotli', 'gzip'] as const,
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
      pwa: false,
      pwaOptions: {
        manifest: {
          description:
            'Vben Admin Pro is a modern admin dashboard template based on Vue 3. ',
          icons: [
            {
              sizes: '192x192',
              src: 'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.3/source/pwa-icon-192.png',
              type: 'image/png',
            },
            {
              sizes: '512x512',
              src: 'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.3/source/pwa-icon-512.png',
              type: 'image/png',
            },
          ],
          name: `Vben Admin Pro ${mode}`,
          short_name: `Vben Admin Pro ${mode}`,
        },
      },
      visualizer: false,
    };
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          // 代理目标地址 - backend-mock 项目
          target: 'http://localhost:5320/api',
          ws: true,
        },
      },
    },
  },
});
