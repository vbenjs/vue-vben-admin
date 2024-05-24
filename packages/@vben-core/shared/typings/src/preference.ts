type LayoutType =
  | 'full-content'
  | 'header-nav'
  | 'mixed-nav'
  | 'side-mixed-nav'
  | 'side-nav';

type BreadcrumbStyle = 'background' | 'normal';

type NavigationStyle = 'plain' | 'rounded';

type ThemeType = 'auto' | 'dark' | 'light';

type ContentCompactType = 'compact' | 'wide';

type LayoutHeaderMode = 'auto' | 'auto-scroll' | 'fixed' | 'static';

type PageTransitionType = 'fade-slide';

type AuthPageLayout = 'panel-center' | 'panel-left' | 'panel-right';

type SupportLocale = 'en-US' | 'zh-CN';

interface Language {
  key: SupportLocale;
  text: string;
}

interface Preference {
  /** 应用名 */
  appName: string;
  /** 登录注册页面布局 */
  authPageLayout: AuthPageLayout;
  /** 面包屑是否只有一个时隐藏 */
  breadcrumbHideOnlyOne: boolean;
  /** 面包屑首页图标是否可见 */
  breadcrumbHome: boolean;
  /** 面包屑图标是否可见 */
  breadcrumbIcon: boolean;
  /** 面包屑类型 */
  breadcrumbStyle: BreadcrumbStyle;
  /** 面包屑是否可见 */
  breadcrumbVisible: boolean;
  /** 是否开启灰色模式 */
  colorGrayMode: boolean;
  /** 主题色 */
  colorPrimary: string;
  /** 是否开启色弱模式 */
  colorWeakMode: boolean;
  /** 是否开启紧凑模式 */
  compact: boolean;
  /** 是否开启内容紧凑模式 */
  contentCompact: ContentCompactType;
  /** 页脚Copyright */
  copyright: string;
  /** 应用默认头像 */
  defaultAvatar: string;
  /** 开启动态标题 */
  dynamicTitle: boolean;
  /** 页脚是否固定 */
  footerFixed: boolean;
  /** 页脚是否可见 */
  footerVisible: boolean;
  /** header显示模式 */
  headerMode: LayoutHeaderMode;
  /** 顶栏是否可见 */
  headerVisible: boolean;
  /** 是否移动端 */
  isMobile: boolean;
  /** 开启标签页缓存功能 */
  keepAlive: boolean;
  /** 布局方式 */
  layout: LayoutType;
  /** 支持的语言 */
  locale: SupportLocale;
  /** 应用Logo */
  logo: string;
  /** logo是否可见 */
  logoVisible: boolean;
  /** 导航菜单手风琴模式 */
  navigationAccordion: boolean;
  /** 导航菜单是否切割，只在 layout=mixed-nav 生效 */
  navigationSplit: boolean;
  /** 导航菜单风格 */
  navigationStyle: NavigationStyle;
  /** 是否开启页面加载进度条 */
  pageProgress: boolean;
  /** 页面切换动画 */
  pageTransition: PageTransitionType;
  /** 页面切换动画是否启用 */
  pageTransitionEnable: boolean;
  /** 是否开启半深色菜单（只在theme='light'时生效） */
  semiDarkMenu: boolean;
  /** 是否显示偏好设置 */
  showPreference: boolean;
  /** 侧边栏是否折叠 */
  sideCollapse: boolean;
  /** 侧边栏折叠时，是否显示title */
  sideCollapseShowTitle: boolean;
  /** 菜单自动展开状态 */
  sideExpandOnHover: boolean;
  /** 侧边栏扩展区域是否折叠 */
  sideExtraCollapse: boolean;
  /** 侧边栏是否可见 */
  sideVisible: boolean;
  /** 侧边栏宽度 */
  sideWidth: number;
  /** 是否开启多标签页图标 */
  tabsIcon: boolean;
  /** 是否开启多标签页 */
  tabsVisible: boolean;
  /** 当前主题 */
  theme: ThemeType;
}

// 这些属性是静态的，不会随着用户的操作而改变
interface StaticPreference {
  /** 主题色预设 */
  colorPrimaryPresets: string[];
  /** 支持的语言 */
  supportLanguages: Language[];
}

type PreferenceKeys = keyof Preference;

export type {
  AuthPageLayout,
  BreadcrumbStyle,
  ContentCompactType,
  LayoutHeaderMode,
  LayoutType,
  PageTransitionType,
  Preference,
  PreferenceKeys,
  StaticPreference,
  SupportLocale,
  ThemeType,
};
