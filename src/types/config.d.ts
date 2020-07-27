// 左侧菜单, 顶部菜单
import { MenuTypeEnum, MenuModeEnum, MenuThemeEnum } from '@/enums/menuEnum';
import { ContentEnum, AuthModeEnum } from '@/enums/appEnum';

export interface MessageSetting {
  title: string;
  // 取消按钮的文字,
  cancelText: string;
  // 确认按钮的文字
  okText: string;
}
export interface MenuSetting {
  collapsed: boolean;
  hasDrag: boolean;
  showSearch: boolean;
  show: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: MenuThemeEnum;
}

export interface MultiTabsSetting {
  // 是否显示
  show: boolean;
  // 开启快速操作
  showQuick: boolean;
  // 显示icon
  showIcon: boolean;
}

export interface HeaderSetting {
  show: boolean;
  theme: MenuThemeEnum;
}
export interface ProjectConfig {
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 显示github
  showGithubButton: boolean;
  // 权限模式
  authMode: AuthModeEnum;
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
  // 使用error-handler-plugin
  useErrorHandle: boolean;
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
  GLOB_APP_TITLE: string;

  // 项目路径
  GLOB_API_URL: string;

  GLOB_API_URL_PREFIX?: string;

  GLOB_APP_SHORT_NAME: string;
}

export interface DesignConfig {
  // 样式前缀
  prefixCls: string;
  // 图标样式前缀
  iconPrefixCls: string;
}
//  修改配置
export type SetProjectSettingFn = <T extends keyof ProjectConfig>(
  key: T,
  value: ProjectConfig[T]
) => void;

export type SettingWrap = GlobWrap & ProjectSettingWrap & DesignSettingWrap;
interface GlobWrap {
  globSetting: Readonly<GlobConfig>;
}
interface ProjectSettingWrap {
  projectSetting: Readonly<ProjectConfig>;
}

interface DesignSettingWrap {
  designSetting: Readonly<DesignConfig>;
}
