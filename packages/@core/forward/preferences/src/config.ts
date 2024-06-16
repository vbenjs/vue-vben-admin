import type { Preferences } from './types';

const defaultPreferences: Preferences = {
  app: {
    authPageLayout: 'panel-right',
    colorGrayMode: false,
    colorWeakMode: false,
    compact: false,
    contentCompact: 'wide',
    copyright: 'Copyright © 2024 Vben Admin PRO',
    defaultAvatar:
      'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.0/source/avatar-v1.webp',
    dynamicTitle: true,
    isMobile: false,
    layout: 'sidebar-nav',
    locale: 'zh-CN',
    name: 'Vben Admin Pro',
    semiDarkMenu: true,
    showPreference: true,
    themeMode: 'dark',
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  footer: {
    enable: true,
    fixed: true,
  },
  header: {
    enable: true,
    hidden: false,
    mode: 'fixed',
  },
  logo: {
    enable: true,
    source:
      'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.0/source/logo-v1.webp',
  },
  navigation: {
    accordion: true,
    split: true,
    styleType: 'rounded',
  },
  shortcutKeys: {
    enable: true,
    globalLogout: true,
    globalPreferences: true,
    globalSearch: true,
  },
  sidebar: {
    collapsed: false,
    collapsedShowTitle: true,
    enable: true,
    expandOnHover: true,
    extraCollapse: true,
    hidden: false,
    width: 240,
  },
  tabbar: {
    enable: true,
    keepAlive: true,
    showIcon: true,
  },
  theme: {
    colorPrimary: 'hsl(211 91% 39%)',
  },
  transition: {
    enable: true,
    name: 'fade-slide',
    progress: true,
  },
};

export { defaultPreferences };
