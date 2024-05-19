import type {
  ContentCompactType,
  LayoutHeaderMode,
  LayoutType,
  ThemeType,
} from '@vben-core/typings';

interface VbenLayoutProps {
  /**
   * 内容区域定宽
   * @default 'wide'
   */
  contentCompact?: ContentCompactType;
  /**
   * 定宽布局宽度
   * @default 1200
   */
  contentCompactWidth?: number;
  /**
   * padding
   * @default 16
   */
  contentPadding?: number;
  /**
   * paddingBottom
   * @default 16
   */
  contentPaddingBottom?: number;
  /**
   * paddingLeft
   * @default 16
   */
  contentPaddingLeft?: number;
  /**
   * paddingRight
   * @default 16
   */
  contentPaddingRight?: number;
  /**
   * paddingTop
   * @default 16
   */
  contentPaddingTop?: number;
  /**
   * footer背景颜色
   * @default #fff
   */
  footerBackgroundColor?: string;
  /**
   * footer 是否固定
   * @default true
   */
  footerFixed?: boolean;
  /**
   * footer 高度
   * @default 32
   */
  footerHeight?: number;
  /**
   * footer 是否可见
   * @default false
   */
  footerVisible?: boolean;
  /**
   * 背景颜色
   * @default #fff
   */
  headerBackgroundColor?: string;
  /**
   * header高度
   * @default 48
   */
  headerHeight?: number;
  /**
   * header高度增加高度
   * 在顶部存在导航时，额外加高header高度
   * @default 10
   */
  headerHeightOffset?: number;
  /**
   * header 显示模式
   * @default 'fixed'
   */
  headerMode?: LayoutHeaderMode;
  /**
   * header是否显示
   * @default true
   */
  headerVisible?: boolean;
  /**
   * 是否移动端显示
   * @default false
   */
  isMobile?: boolean;
  /**
   * 布局方式
   * side-nav 侧边菜单布局
   * header-nav 顶部菜单布局
   * mixed-nav 侧边&顶部菜单布局
   * side-mixed-nav 侧边混合菜单布局
   * full-content 全屏内容布局
   * @default side-nav
   */
  layout?: LayoutType;
  /**
   * 侧边菜单折叠状态
   * @default false
   */
  sideCollapse?: boolean;
  /**
   * 侧边菜单是否折叠时，是否显示title
   * @default true
   */
  sideCollapseShowTitle?: boolean;
  /**
   *  侧边菜单折叠宽度
   * @default 48
   */
  sideCollapseWidth?: number;
  /**
   * 混合侧边扩展区域是否可见
   * @default false
   */
  sideMixedExtraVisible?: boolean;
  /**
   * 混合侧边栏宽度
   * @default 80
   */
  sideMixedWidth?: number;
  /**
   * 侧边栏是否半深色
   * @default false
   */
  sideSemiDark?: boolean;
  /**
   * 侧边栏
   * @default dark
   */
  sideTheme?: ThemeType;
  /**
   * 侧边栏是否可见
   * @default true
   */
  sideVisible?: boolean;
  /**
   * 侧边栏宽度
   * @default 210
   */
  sideWidth?: number;
  /**
   * footer背景颜色
   * @default #fff
   */
  tabsBackgroundColor?: string;
  /**
   * tab高度
   * @default 30
   */
  tabsHeight?: number;
  /**
   * tab是否可见
   * @default true
   */
  tabsVisible?: boolean;
  /**
   * zIndex
   * @default 100
   */
  zIndex?: number;
}
export type { VbenLayoutProps };
