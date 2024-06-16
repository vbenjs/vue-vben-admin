import type {
  ContentCompactType,
  LayoutHeaderModeType,
  LayoutType,
  SupportedLanguagesType,
  ThemeModeType,
} from '@vben-core/typings';

type BreadcrumbStyleType = 'background' | 'normal';

type NavigationStyleType = 'plain' | 'rounded';

type PageTransitionType = 'fade' | 'fade-down' | 'fade-slide' | 'fade-up';

type AuthPageLayoutType = 'panel-center' | 'panel-left' | 'panel-right';

interface AppPreferences {
  /** 是否开启vben助手 */
  aiAssistant: boolean;
  /** 登录注册页面布局 */
  authPageLayout: AuthPageLayoutType;
  /** 是否开启灰色模式 */
  colorGrayMode: boolean;
  /** 是否开启色弱模式 */
  colorWeakMode: boolean;
  /** 是否开启紧凑模式 */
  compact: boolean;
  /** 是否开启内容紧凑模式 */
  contentCompact: ContentCompactType;
  /** 页脚Copyright */
  copyright: string;
  // /** 应用默认头像 */
  defaultAvatar: string;
  // /** 开启动态标题 */
  dynamicTitle: boolean;
  /** 是否移动端 */
  isMobile: boolean;
  /** 布局方式 */
  layout: LayoutType;
  /** 支持的语言 */
  locale: SupportedLanguagesType;
  /** 应用名 */
  name: string;
  /** 是否开启半深色菜单（只在theme='light'时生效） */
  semiDarkMenu: boolean;
  /** 是否显示偏好设置 */
  showPreference: boolean;
  /** 当前主题 */
  themeMode: ThemeModeType;
}

interface BreadcrumbPreferences {
  /** 面包屑是否启用 */
  enable: boolean;
  /** 面包屑是否只有一个时隐藏 */
  hideOnlyOne: boolean;
  /** 面包屑首页图标是否可见 */
  showHome: boolean;
  /** 面包屑图标是否可见 */
  showIcon: boolean;
  /** 面包屑风格 */
  styleType: BreadcrumbStyleType;
}

interface FooterPreferences {
  /** 底栏是否可见 */
  enable: boolean;
  /** 底栏是否固定 */
  fixed: boolean;
}

interface HeaderPreferences {
  /** 顶栏是否启用 */
  enable: boolean;
  /** 顶栏是否隐藏,css-隐藏 */
  hidden: boolean;
  /** header显示模式 */
  mode: LayoutHeaderModeType;
}

interface LogoPreferences {
  /** logo是否可见 */
  enable: boolean;
  /** logo地址 */
  source: string;
}

interface NavigationPreferences {
  /** 导航菜单手风琴模式 */
  accordion: boolean;
  /** 导航菜单是否切割，只在 layout=mixed-nav 生效 */
  split: boolean;
  /** 导航菜单风格 */
  styleType: NavigationStyleType;
}

interface SidebarPreferences {
  /** 侧边栏是否折叠 */
  collapsed: boolean;
  /** 侧边栏折叠时，是否显示title */
  collapsedShowTitle: boolean;
  /** 侧边栏是否可见 */
  enable: boolean;
  /** 菜单自动展开状态 */
  expandOnHover: boolean;
  /** 侧边栏扩展区域是否折叠 */
  extraCollapse: boolean;
  /** 侧边栏是否隐藏 - css */
  hidden: boolean;
  /** 侧边栏宽度 */
  width: number;
}

interface ShortcutKeyPreferences {
  /** 是否启用快捷键-全局 */
  enable: boolean;
  /** 是否启用全局注销快捷键 */
  globalLogout: boolean;
  /** 是否启用全局偏好设置快捷键 */
  globalPreferences: boolean;
  /** 是否启用全局搜索快捷键 */
  globalSearch: boolean;
}

interface TabbarPreferences {
  /** 是否开启多标签页 */
  enable: boolean;
  /** 开启标签页缓存功能 */
  keepAlive: boolean;
  /** 是否开启多标签页图标 */
  showIcon: boolean;
}

interface ThemePreferences {
  /** 主题色 */
  colorPrimary: string;
}

interface TransitionPreferences {
  /** 页面切换动画是否启用 */
  enable: boolean;
  /** 页面切换动画 */
  name: PageTransitionType | string;
  /** 是否开启页面加载进度动画 */
  progress: boolean;
}

interface Preferences {
  /** 全局配置 */
  app: AppPreferences;
  /** 顶栏配置 */
  breadcrumb: BreadcrumbPreferences;
  /** 底栏配置 */
  footer: FooterPreferences;
  /** 面包屑配置 */
  header: HeaderPreferences;
  /** logo配置 */
  logo: LogoPreferences;
  /** 导航配置 */
  navigation: NavigationPreferences;
  /** 快捷键配置 */
  shortcutKeys: ShortcutKeyPreferences;
  /** 侧边栏配置 */
  sidebar: SidebarPreferences;
  /** 标签页配置 */
  tabbar: TabbarPreferences;
  /** 主题配置 */
  theme: ThemePreferences;
  /** 动画配置 */
  transition: TransitionPreferences;
}

type PreferencesKeys = keyof Preferences;

export type {
  AppPreferences,
  AuthPageLayoutType,
  BreadcrumbPreferences,
  BreadcrumbStyleType,
  ContentCompactType,
  FooterPreferences,
  HeaderPreferences,
  LayoutHeaderModeType,
  LayoutType,
  LogoPreferences,
  NavigationPreferences,
  NavigationStyleType,
  PageTransitionType,
  Preferences,
  PreferencesKeys,
  ShortcutKeyPreferences,
  SidebarPreferences,
  SupportedLanguagesType,
  TabbarPreferences,
  ThemeModeType,
  ThemePreferences,
  TransitionPreferences,
};
