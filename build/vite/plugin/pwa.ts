import { VitePWA } from 'vite-plugin-pwa';
import type { Plugin } from 'vite';
import { ViteEnv } from '../../utils';

export function setupPwaPlugin(
  plugins: Plugin[],
  env: ViteEnv,
  // @ts-ignore
  mode: 'development' | 'production'
) {
  const { VITE_USE_PWA } = env;

  const pwaPlugin = VitePWA({
    manifest: {
      name: 'Vben Admin',
      short_name: 'vben_admin',
      icons: [
        {
          src: './resource/img/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: './resource/img/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  });
  if (VITE_USE_PWA) {
    plugins.push(pwaPlugin);
  }
  return plugins;
}
