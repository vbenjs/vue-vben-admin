import type { Plugin } from 'vite';
import ViteHtmlPlugin from 'vite-plugin-html';
import { isProdFn, isSiteMode, ViteEnv } from '../../utils';

import { hmScript } from '../hm';
// @ts-ignore
import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function setupHtmlPlugin(
  plugins: Plugin[],
  env: ViteEnv,
  mode: 'development' | 'production'
) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;

  const htmlPlugin = ViteHtmlPlugin({
    // html title
    title: VITE_GLOB_APP_TITLE,
    minify: isProdFn(mode),
    options: {
      publicPath: VITE_PUBLIC_PATH,
      // Package and insert additional configuration files
      injectConfig: isProdFn(mode)
        ? `<script src='${VITE_PUBLIC_PATH || './'}${GLOB_CONFIG_FILE_NAME}?v=${
            pkg.version
          }-${new Date().getTime()}'></script>`
        : '',
      // Insert Baidu statistics code
      hmScript: isSiteMode() ? hmScript : '',
      title: VITE_GLOB_APP_TITLE,
    },
  });

  plugins.push(htmlPlugin);
  return plugins;
}
