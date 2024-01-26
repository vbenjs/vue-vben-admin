import { type UserConfig } from 'vite';

const proxyConfig: (envs: Record<string, string>) => UserConfig = (envs) => ({
  server: {
    host: true,
    proxy: {
      '/vbenapi': {
        target: envs.VITE_APP_PROXY_URL || 'http://localhost:3300',
        changeOrigin: true,
        // ws: true,
        // rewrite: (path) => path.replace(new RegExp(`^/vbenapi`), ''),
        // only https
        // secure: false
      },
      '/upload': {
        target: 'http://localhost:3300/upload',
        changeOrigin: true,
        ws: true,
        rewrite: (path: string) => path.replace(new RegExp(`^/upload`), ''),
      },
    },
  },
});

export { proxyConfig };
