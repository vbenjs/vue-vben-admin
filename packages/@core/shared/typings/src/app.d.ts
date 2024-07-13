type SupportedLanguagesType = 'en-US' | 'zh-CN';

type LayoutType =
  | 'full-content'
  | 'header-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

type BuiltinThemeType =
  | 'custom'
  | 'deep-blue'
  | 'deep-green'
  | 'default'
  | 'default'
  | 'gray'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'pink'
  | 'red'
  | 'rose'
  | 'sky-blue'
  | 'slate'
  | 'stone'
  | 'violet'
  | 'yellow'
  | 'zinc';

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';

/**
 * 登录过期模式
 * 'modal' 弹窗模式 | 'page' 页面模式
 */
type LoginExpiredModeType = 'modal' | 'page';

type BreadcrumbStyleType = 'background' | 'normal';

type AccessModeType = 'allow-all' | 'backend' | 'frontend';

type NavigationStyleType = 'plain' | 'rounded';

type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up';

type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right';

export type {
  AccessModeType,
  AuthPageLayoutType,
  BreadcrumbStyleType,
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  LoginExpiredModeType,
  NavigationStyleType,
  PageTransitionType,
  SupportedLanguagesType,
  ThemeModeType,
};
