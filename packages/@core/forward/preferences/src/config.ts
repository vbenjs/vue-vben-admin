import type { Preferences } from './types';

const defaultPreferences: Preferences = {
  app: {
    accessMode: 'frontend',
    aiAssistant: true,
    authPageLayout: 'panel-right',
    colorGrayMode: false,
    colorWeakMode: false,
    compact: false,
    contentCompact: 'wide',
    defaultAvatar:
      'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.0/source/avatar-v1.webp',
    dynamicTitle: true,
    enablePreferences: true,
    isMobile: false,
    layout: 'sidebar-nav',
    locale: 'zh-CN',
    name: 'Vben Admin Pro',
    semiDarkMenu: true,
  },
  breadcrumb: {
    enable: true,
    hideOnlyOne: false,
    showHome: false,
    showIcon: true,
    styleType: 'normal',
  },
  copyright: {
    companyName: 'Vben Admin Pro',
    companySiteLink: 'https://www.vben.pro',
    date: '2024',
    enable: true,
    icp: '',
    icpLink: '',
  },
  footer: {
    enable: true,
    fixed: false,
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
    builtinType: 'default',
    colorDestructive: 'hsl(348 100% 61%)',
    colorPrimary: 'hsl(245 82% 67%)',
    colorSuccess: 'hsl(144 57% 58%)',
    colorWarning: 'hsl(42 84% 61%)',
    mode: 'dark',
    radius: '0.5',
  },
  transition: {
    enable: true,
    loading: true,
    name: 'fade-slide',
    progress: true,
  },
};

export { defaultPreferences };
