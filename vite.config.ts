import { defineApplicationConfig } from '@vben/vite-config';
import Inspector from 'vite-plugin-vue-inspector';

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
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5001/api',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), ''),
          // only https
          // secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to the Target:', req.method, req.url);
              console.log(proxyReq.host + ':' + proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        },
        '/upload': {
          target: 'http://localhost:5001/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
          secure: false,
        },
      },
      // open: true, // 项目启动后，自动打开
      // warmup: {
      //   clientFiles: ['./index.html', './src/{views,components}/*'],
      // },
    },
    // plugins: [
    //   Inspector({
    //     openInEditorHost: 'http://localhost:5173',
    //   }),
    // ],
  },
});
