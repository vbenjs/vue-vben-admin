import { defineConfig, viteCssLayerPlugin } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      plugins: [
        // tdesign 的 css 包进 @layer td，使 Tailwind 工具类可覆盖组件样式
        viteCssLayerPlugin({
          layerName: 'td',
          packageName: 'tdesign-vue-next',
        }),
      ],
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
