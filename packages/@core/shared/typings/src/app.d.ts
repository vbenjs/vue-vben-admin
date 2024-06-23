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

export type {
  BuiltinThemeType,
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  SupportedLanguagesType,
  ThemeModeType,
};
