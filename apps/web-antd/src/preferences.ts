import { defineOverridesPreferences } from '@vben/preferences';

import defaultAvatarImg from '/static/avatar_default.png';
/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    defaultHomePath: '/test3',
    enablePreferences: false,
    enableCheckUpdates: false,
    watermark: false,
    defaultAvatar: defaultAvatarImg,
  },
  theme: {
    mode: 'light',
    colorPrimary: 'hsl(222 100% 54%)',
  },
  widget: {
    languageToggle: false,
    fullscreen: false,
    globalSearch: false,
    lockScreen: false,
    notification: false,
    refresh: false,
    sidebarToggle: true,
    themeToggle: false,
  },
  footer: {
    enable: true,
    fixed: true,
  },
  tabbar: {
    enable: false,
  },
  shortcutKeys: {
    enable: false,
  },
});
