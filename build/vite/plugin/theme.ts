/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite';
import {
  viteThemePlugin,
  antdDarkThemePlugin,
  mixLighten,
  mixDarken,
  tinycolor,
} from 'vite-plugin-theme';
import { getThemeColors, generateColors } from '../../config/themeConfig';
import { generateModifyVars } from '../../generate/generateModifyVars';

export function configThemePlugin(isBuild: boolean): Plugin[] {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
  });
  const plugin = [
    viteThemePlugin({
      resolveSelector: (s) => `[data-theme] ${s}`,
      colorVariables: [...getThemeColors(), ...colors],
    }),
    antdDarkThemePlugin({
      filter: (id) => {
        if (isBuild) {
          return !id.endsWith('antd.less');
        }
        return true;
      },
      // extractCss: false,
      darkModifyVars: {
        ...generateModifyVars(true),
        'text-color': '#c9d1d9',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        // black: '#0e1117',
        // #8b949e
        'text-color-secondary': '#8b949e',
        // 'border-color-base': '#30363d',
        // 'border-color-split': '#30363d',
        'item-active-bg': '#111b26',
      },
    }),
  ];

  return (plugin as unknown) as Plugin[];
}
