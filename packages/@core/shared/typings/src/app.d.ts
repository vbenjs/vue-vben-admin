type SupportedLanguagesType = 'en-US' | 'zh-CN';

type LayoutType =
  | 'full-content'
  | 'header-nav'
  | 'mixed-nav'
  | 'sidebar-mixed-nav'
  | 'sidebar-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';

export type {
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  SupportedLanguagesType,
  ThemeModeType,
};
