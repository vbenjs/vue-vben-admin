import {
  defaultImportmapOptions,
  defineConfig,
  getDefaultPwaOptions,
  loadAndConvertEnv,
} from '@vben/vite-config';

export default defineConfig(async () => {
  const { appTitle, port, ...envConfig } = await loadAndConvertEnv();
  return {
    application: {
      ...envConfig,
      importmap: false,
      importmapOptions: defaultImportmapOptions,
      pwa: false,
      pwaOptions: getDefaultPwaOptions(appTitle),
    },
    vite: {
      server: {
        port,
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
  };
});
