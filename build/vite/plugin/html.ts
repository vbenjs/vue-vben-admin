import type { Plugin } from 'vite';
import type { ViteEnv } from '../../utils';
import html from 'vite-plugin-html';

import pkg from '../../../package.json';
import { GLOB_CONFIG_FILE_NAME } from '../../constant';

export function configHtmlPlugin(env: ViteEnv, isBuild: boolean) {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env;
  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`;

  const htmlPlugin: Plugin[] = html({
    minify: isBuild,
    inject: {
      injectData: {
        title: VITE_GLOB_APP_TITLE,
      },
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: `${path || '/'}${GLOB_CONFIG_FILE_NAME}?v=${
                  pkg.version
                }-${new Date().getTime()}`,
              },
            },
          ]
        : [],
    },
  });
  return htmlPlugin;
}
