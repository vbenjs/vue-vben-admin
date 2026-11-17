import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    // ant-design-vue 的组件样式是运行时 CSS-in-JS 注入（非静态 css 文件），
    // 共享的 loadApplicationPlugins 已为所有应用注册 viteCssLayerPlugin
    // （包 vxe / tippy 等静态第三方样式），但包不住这些运行时样式；
    // 详见 theme.css 层序注释与 adapter/component 中 InputNumber 的说明。
    application: {},
    vite: {
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
