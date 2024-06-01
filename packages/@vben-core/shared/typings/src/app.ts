type LocaleSupportType = 'en-US' | 'zh-CN';

type LayoutType =
  | 'full-content'
  | 'header-nav'
  | 'mixed-nav'
  | 'side-mixed-nav'
  | 'side-nav';

type ThemeModeType = 'auto' | 'dark' | 'light';

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderModeType = 'auto' | 'auto-scroll' | 'fixed' | 'static';

export type {
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  LocaleSupportType,
  ThemeModeType,
};
