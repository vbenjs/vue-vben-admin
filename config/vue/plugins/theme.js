const ThemeColorReplacer = require('webpack-theme-color-replacer');
const generate = require('@ant-design/colors/lib/generate').default;
const { primaryColor } = require('../../glob/lessModifyVars.js');

const getAntdSerials = (color) => {
  const lightens = new Array(9).fill().map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10);
  });
  const colorPalettes = generate(color);
  return lightens.concat(colorPalettes);
};

const themePluginOption = {
  fileName: 'css/theme-colors-[contenthash:8].css',
  matchColors: getAntdSerials(primaryColor),
  changeSelector(selector, util) {
    switch (selector) {
      case '.ant-calendar-today .ant-calendar-date':
        return ':not(.ant-calendar-selected-date):not(.ant-calendar-selected-day)' + selector;
      case '.ant-btn:focus,.ant-btn:hover':
        return '.ant-btn:focus:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:hover:not(.ant-btn-primary):not(.ant-btn-danger)';
      case '.ant-btn.active,.ant-btn:active':
        return '.ant-btn.active:not(.ant-btn-primary):not(.ant-btn-danger),.ant-btn:active:not(.ant-btn-primary):not(.ant-btn-danger)';
      case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
        return ':not(.ant-steps-item-process)' + selector;
      case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
      case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
        return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover';
      case '.ant-menu-horizontal > .ant-menu-item-selected > a':
        return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item-selected > a';
      case '.ant-menu-horizontal > .ant-menu-item > a:hover':
        return '.ant-menu-horizontal:not(ant-menu-light):not(.ant-menu-dark) > .ant-menu-item > a:hover';
      case 'a:hover':
        return 'body .ant-menu-item > a:hover';
      default:
        return util.changeEach(selector, '', 'body ');
    }
  },
};

const createThemeColorReplacerPlugin = (config) => {
  config.plugin('theme-color-replace').use(ThemeColorReplacer, [themePluginOption]);
};

module.exports = {
  createThemeColorReplacerPlugin,
};
