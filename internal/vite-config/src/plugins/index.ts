import { type PluginOption } from 'vite';
import { configHtmlPlugin } from './html';
import { configMockPlugin } from './mock';
import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';
import { configSvgIconsPlugin } from './svgSprite';
import { createAppConfigPlugin } from './appConfig';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import purgeIcons from 'vite-plugin-purge-icons';
import windiCSS from 'vite-plugin-windicss';

interface Options {
  isBuild: boolean;
  root: string;
  compress: string;
  enableMock?: boolean;
  enableAnalyze?: boolean;
}

async function createPlugins({ isBuild, root, enableMock, compress, enableAnalyze }: Options) {
  const vitePlugins: (PluginOption | PluginOption[])[] = [vue(), vueJsx()];

  const appConfigPlugin = await createAppConfigPlugin({ root, isBuild });
  vitePlugins.push(appConfigPlugin);

  // vite-plugin-windicss
  vitePlugins.push(windiCSS());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin({ isBuild }));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin({ isBuild }));

  // vite-plugin-purge-icons
  vitePlugins.push(purgeIcons());

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin({
        compress,
      }),
    );
  }

  // rollup-plugin-visualizer
  if (enableAnalyze) {
    vitePlugins.push(configVisualizerConfig());
  }

  // vite-plugin-mock
  if (enableMock) {
    vitePlugins.push(configMockPlugin({ isBuild }));
  }

  return vitePlugins;
}

export { createPlugins };
