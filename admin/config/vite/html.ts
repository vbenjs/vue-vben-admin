/**
 * Plugin to minimize and use ejs template syntax in index.html.
 * @see https://github.com/anncwb/vite-plugin-html
 */

import { GLOB_CONFIG_FILE_NAME, PKG_VERSION } from '..'
import html from 'vite-plugin-html'

export const configHtmlPlugin = (env: ViteEnv, isBuild: boolean) => {
  const { VITE_GLOB_APP_TITLE, VITE_PUBLIC_PATH } = env

  const path = VITE_PUBLIC_PATH.endsWith('/')
    ? VITE_PUBLIC_PATH
    : `${VITE_PUBLIC_PATH}/`

  const getAppConfigSrc = () => {
    return `${
      path || '/'
    }${GLOB_CONFIG_FILE_NAME}?v=${PKG_VERSION}-${new Date().getTime()}`
  }

  const htmlPlugin = html({
    minify: isBuild,
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
      // Embed the generated app.config.js file
      tags: isBuild
        ? [
            {
              tag: 'script',
              attrs: {
                src: getAppConfigSrc(),
              },
            },
          ]
        : [],
    },
  })
  return htmlPlugin
}
