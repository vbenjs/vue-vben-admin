/**
 * Vite Plugin for fast creating SVG sprites.
 * @see https://github.com/anncwb/vite-plugin-svg-icons
 */

import SvgIconsPlugin from 'vite-plugin-svg-icons'
import { resolve } from 'path'

export const configSvgIconsPlugin = (isBuild: boolean) => {
  const svgIconsPlugin = SvgIconsPlugin({
    iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
    svgoOptions: isBuild,
  })
  return svgIconsPlugin
}
