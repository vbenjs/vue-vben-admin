/**
 * Vite plugin for website theme color switching
 * https://github.com/anncwb/vite-plugin-theme
 */
import type { Plugin } from 'vite';
import path from 'path';
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
      resolveSelector: (s) => {
        s = s.trim();
        switch (s) {
          case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
            return '.ant-steps-item-icon > .ant-steps-icon';
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
          case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
            return s;
          case '.ant-steps-item-icon > .ant-steps-icon':
            return s;
          default:
            if (s.indexOf('.ant-alert-message') >= 0) {
              console.log(s);
            }
            return s;
        }
        return `[data-theme] ${s}`;
      },
      colorVariables: [...getThemeColors(), ...colors],
    }),
    antdDarkThemePlugin({
      preloadFiles: [
        //path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.less'),
        path.resolve(process.cwd(), 'node_modules/ant-design-vue/dist/antd.dark.less'),
        path.resolve(process.cwd(), 'src/design/index.less'),
      ],
      filter: (id) => (isBuild ? !id.endsWith('antd.less') : true),
      // extractCss: false,
      darkModifyVars: {
        ...generateModifyVars(true),
        'text-color': '#c9d1d9',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        'heading-color': 'rgb(255 255 255 / 65%)',
        // black: '#0e1117',
        // #8b949e
        'text-color-secondary': '#8b949e',
        'border-color-base': '#303030',
        // 'border-color-split': '#30363d',
        'item-active-bg': '#111b26',
        'app-content-background': 'rgb(255 255 255 / 4%)',
        'tree-node-selected-bg': '#11263c',

        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#111b26',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24',

        //         @alert-success-border-color: @green-3;
        // @alert-success-bg-color: @green-1;
        // @alert-success-icon-color: @success-color;
        // @alert-info-border-color: @primary-3;
        // @alert-info-bg-color: @primary-1;
        // @alert-info-icon-color: @info-color;
        // @alert-warning-border-color: @gold-3;
        // @alert-warning-bg-color: @gold-1;
        // @alert-warning-icon-color: @warning-color;
        // @alert-error-border-color: @red-3;
        // @alert-error-bg-color: @red-1;
        // @alert-error-icon-color: @error-color;
      },
    }),
  ];

  return plugin as unknown as Plugin[];
}
