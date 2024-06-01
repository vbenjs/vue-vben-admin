import type { Preference, StaticPreference } from '@vben-core/typings';

const defaultPreference: Preference = {
  appName: 'Vben Admin Pro',
  authPageLayout: 'panel-right',
  breadcrumbHideOnlyOne: false,
  breadcrumbHome: false,
  breadcrumbIcon: true,
  breadcrumbStyle: 'normal',
  breadcrumbVisible: true,
  colorGrayMode: false,
  colorPrimary: 'hsl(211 91% 39%)',
  colorWeakMode: false,
  compact: false,
  contentCompact: 'wide',
  copyright: 'Copyright © 2024 Vben Admin PRO',
  defaultAvatar:
    'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.0/source/avatar-v1.webp',
  dynamicTitle: true,
  footerFixed: true,
  footerVisible: true,
  headerHidden: false,
  headerMode: 'fixed',
  headerVisible: true,
  isMobile: false,
  keepAlive: true,
  layout: 'side-nav',
  locale: 'zh-CN',
  logo: 'https://cdn.jsdelivr.net/npm/@vbenjs/static-source@0.1.0/source/logo-v1.webp',
  logoVisible: true,
  navigationAccordion: true,
  navigationSplit: true,
  navigationStyle: 'rounded',
  pageProgress: true,
  pageTransition: 'fade-slide',
  pageTransitionEnable: true,
  semiDarkMenu: true,
  shortcutKeys: true,
  showPreference: true,
  sideCollapse: false,
  sideCollapseShowTitle: true,
  sideExpandOnHover: true,
  sideExtraCollapse: true,
  sideHidden: false,
  sideVisible: true,
  sideWidth: 240,
  tabsIcon: true,
  tabsVisible: true,
  theme: 'dark',
};

/**
 * 静态偏好设置,这些配置不会被用户修改
 */
const staticPreference: StaticPreference = {
  colorPrimaryPresets: [
    'hsl(211 91% 39%)',
    'hsl(212 100% 45%)',
    'hsl(181 84% 32%)',
    'hsl(230 99% 66%)',
    'hsl(245 82% 67%)',
    'hsl(340 100% 68%)',
  ],
  supportLanguages: [
    {
      key: 'zh-CN',
      text: '简体中文',
    },
    {
      key: 'en-US',
      text: 'English',
    },
  ],
};

export { defaultPreference, staticPreference };
