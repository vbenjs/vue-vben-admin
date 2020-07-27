import { ProjectConfig } from '../types/config';

import { MenuTypeEnum, MenuThemeEnum, MenuModeEnum } from '@/enums/menuEnum';
import { ContentEnum, AuthModeEnum } from '@/enums/appEnum';
import { primaryColor } from 'config/glob/lessModifyVars';
// import { isProdMode } from '@/utils/envUtil';

// ! 改动后需要清空浏览器缓存
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,
  // 显示github
  showGithubButton: true,
  // 权限模式
  authMode: AuthModeEnum.ROLE,
  // 网站灰色模式，用于可能悼念的日期开启
  grayMode: false,
  // 色弱模式
  colorWeak: false,
  // 主题色
  themeColor: primaryColor,
  // 是否取消菜单,顶部,多标签页显示, 用于可能内嵌在别的系统内
  fullContent: false,
  // content mode
  contentMode: ContentEnum.FULL,
  // 是否显示logo
  showLogo: true,

  headerSetting: {
    // 是否显示顶部
    show: true,
    // theme
    theme: MenuThemeEnum.LIGHT,
  },
  // 菜单类型
  menuSetting: {
    collapsed: false,
    hasDrag: true,
    show: true,
    showSearch: true,
    menuWidth: 210,
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
    theme: MenuThemeEnum.DARK,
  },
  // 消息配置
  messageSetting: {
    // 弹窗title
    title: '操作提示',
    // 取消按钮的文子,
    cancelText: '取消',
    // 确认按钮的文字
    okText: '确定',
  },
  // 多标签
  multiTabsSetting: {
    // 开启
    show: true,
    // 开启快速操作
    showQuick: true,
    // 显示icon
    showIcon: true,
  },
  // 是否开启KeepAlive缓存  开发时候最好关闭,不然每次都需要清除缓存
  openKeepAlive: true,

  // 自动锁屏时间，为0不锁屏。 单位分钟 默认1个小时
  lockTime: 60,
  // 显示面包屑
  showBreadCrumb: true,

  // 使用error-handler-plugin
  useErrorHandle: true,
};

export default setting;
