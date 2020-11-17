// 左侧菜单, 顶部菜单
import { MenuTypeEnum, MenuModeEnum, MenuThemeEnum, TriggerEnum } from '/@/enums/menuEnum';
import { ContentEnum, PermissionModeEnum, RouterTransitionEnum } from '/@/enums/appEnum';

export interface MessageSetting {
  title: string;
  // 取消按钮的文字,
  cancelText: string;
  // 确认按钮的文字
  okText: string;
}
export interface MenuSetting {
  collapsed: boolean;
  collapsedShowTitle: boolean;
  hasDrag: boolean;
  showSearch: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: MenuThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  collapsedShowSearch: boolean;
  trigger: TriggerEnum;
  accordion: boolean;
}

export interface MultiTabsSetting {
  // 是否显示
  show: boolean;
  // 开启快速操作
  showQuick: boolean;
  // 显示icon
  showIcon: boolean;
  // 缓存最大数量
  max: number;
}

export interface HeaderSetting {
  fixed: boolean;
  show: boolean;
  theme: MenuThemeEnum;
  // 显示刷新按钮
  showRedo: boolean;
  // 显示全屏按钮
  showFullScreen: boolean;
  // 开启全屏功能
  useLockPage: boolean;
  // 显示文档按钮
  showDoc: boolean;
  showGithub: boolean;
  // 显示消息中心按钮
  showNotice: boolean;
}
export interface ProjectConfig {
  locale: string;

  // header背景色
  headerBgColor: string;
  // 左侧菜单背景色
  menuBgColor: string;

  // 是否显示配置按钮
  showSettingButton: boolean;
  // 权限模式
  permissionMode: PermissionModeEnum;
  // 网站灰色模式，用于可能悼念的日期开启
  grayMode: boolean;
  // 是否开启色弱模式
  colorWeak: boolean;
  // 主题色
  themeColor: string;
  // 全屏显示主界面,不显示菜单,及顶部
  fullContent: boolean;
  // 区域宽度
  contentMode: ContentEnum;
  // 是否显示logo
  showLogo: boolean;
  headerSetting: HeaderSetting;
  // 菜单类型
  // menuType: MenuTypeEnum;
  menuSetting: MenuSetting;

  messageSetting: MessageSetting;

  // 多标签页设置
  multiTabsSetting: MultiTabsSetting;
  // pageLayout是否开启keep-alive
  openKeepAlive: boolean;

  // 锁屏时间
  lockTime: number;
  // 显示面包屑
  showBreadCrumb: boolean;
  // 显示面包屑图标
  showBreadCrumbIcon: boolean;
  // 使用error-handler-plugin
  useErrorHandle: boolean;
  // 开启页面切换动画
  openRouterTransition: boolean;
  // 路由切换动画
  routerTransition: RouterTransitionEnum;
  // 是否开启登录安全校验
  openLoginVerify: boolean;
  // 是否开启页面切换loading
  openPageLoading: boolean;
  // 是否开启回到顶部
  useOpenBackTop: boolean;
  // 开启顶部进度条
  openNProgress: boolean;
  // 是否可以嵌入iframe页面
  canEmbedIFramePage: boolean;
  // 切换界面的时候是否删除未关闭的message及notify
  closeMessageOnSwitch: boolean;
  // 切换界面的时候是否取消已经发送但是未响应的http请求。
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // 网站标题
  title: string;
  // 项目路径
  apiUrl: string;
  urlPrefix?: string;
  shortName: string;
}
export interface GlobEnvConfig {
  // 网站标题
  VITE_GLOB_APP_TITLE: string;
  // 项目路径
  VITE_GLOB_API_URL: string;
  VITE_GLOB_API_URL_PREFIX?: string;
  VITE_GLOB_APP_SHORT_NAME: string;
}

//  修改配置
export type SetProjectSettingFn = <T extends keyof ProjectConfig>(
  key: T,
  value: ProjectConfig[T]
) => void;
interface GlobWrap {
  globSetting: Readonly<GlobConfig>;
}
interface ProjectSettingWrap {
  projectSetting: Readonly<ProjectConfig>;
}

export type SettingWrap = GlobWrap & ProjectSettingWrap;
