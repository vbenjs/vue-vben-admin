import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      clearScreen: false,
      server: {
        port: 1420,
        strictPort: true,
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true,
          },
        },
        watch: {
          // 3. tell Vite to ignore watching `src-tauri`
          ignored: ['**/src-tauri/**'],
        },
      },
    },
  };
});
