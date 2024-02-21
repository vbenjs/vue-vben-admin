import type { ProjectConfig } from '#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '@/enums/menuEnum';
import { CacheTypeEnum } from '@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '@/enums/appEnum';
import {
  SIDE_BAR_BG_COLOR_LIST,
  HEADER_PRESET_BG_COLOR_LIST,
  APP_PRESET_COLOR_LIST,
} from './designSetting';

// ! 在更改後需要清除瀏覽器緩存
const setting: ProjectConfig = {
  // 是否顯示設定按鈕
  showSettingButton: false,

  // 是否顯示主題切換按鈕
  showDarkModeToggle: false,

  // 設定按鈕位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // 權限模式
  permissionMode: PermissionModeEnum.ROUTE_MAPPING,

  // 權限相關的緩存存儲在sessionStorage或localStorage中
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 會話超時處理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 主題顏色
  themeColor: APP_PRESET_COLOR_LIST[0],

  // 網站灰色模式，開啟以應對可能的哀悼日期
  grayMode: false,

  // 色弱模式
  colorWeak: false,

  // 是否取消菜單、頂部、多標籤頁顯示，用於可能嵌入其他系統
  fullContent: false,

  // 內容模式
  contentMode: ContentEnum.FULL,

  // 是否顯示標誌
  showLogo: true,

  // 是否顯示頁腳
  showFooter: false,

  // 頁頭配置
  headerSetting: {
    // 頁頭背景顏色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 固定在頂部
    fixed: true,
    // 是否顯示頂部
    show: true,
    // 主題
    theme: ThemeEnum.LIGHT,
    // 是否啟用鎖屏功能
    useLockPage: true,
    // 是否顯示全屏按鈕
    showFullScreen: true,
    // 是否顯示文檔按鈕
    showDoc: false,
    // 是否顯示通知按鈕
    showNotice: false,
    // 是否顯示菜單搜索
    showSearch: false,
    // 切換API
    showApi: false,
  },

  // 菜單配置
  menuSetting: {
    // 側邊欄菜單背景顏色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 是否固定左側菜單
    fixed: true,
    // 菜單折疊
    collapsed: false,
    // 響應式布局導致側邊欄隱藏時
    siderHidden: false,
    // 折疊菜單時是否顯示菜單名稱
    collapsedShowTitle: false,
    // 是否可拖拽
    // 只限於開啟左側菜單，鼠標在菜單右側有一個拖拽條
    canDrag: false,
    // 是否顯示無dom
    show: true,
    // 是否顯示dom
    hidden: false,
    // 菜單寬度
    menuWidth: 210,
    // 菜單模式
    mode: MenuModeEnum.INLINE,
    // 菜單類型
    type: MenuTypeEnum.SIDEBAR,
    // 菜單主題
    theme: ThemeEnum.DARK,
    // 分割菜單
    split: false,
    // 頂部菜單布局
    topMenuAlign: 'center',
    // 折疊觸發位置
    trigger: TriggerEnum.HEADER,
    // 啟用手風琴模式，只顯示一個菜單
    accordion: true,
    // 切換頁面時關閉菜單
    closeMixSidebarOnChange: false,
    // 模塊開啟方式 ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 固定展開菜單
    mixSideFixed: false,
  },

  // 多標籤
  multiTabsSetting: {
    cache: false,
    // 是否開啟
    show: true,
    // 是否可以拖拽排序標籤
    canDrag: true,
    // 是否開啟快速操作
    showQuick: true,
    // 是否顯示刷新按鈕
    showRedo: true,
    // 是否顯示折疊按鈕
    showFold: true,
    // 自動折疊
    autoCollapse: false,
  },

  // 過渡設置
  transitionSetting: {
    // 是否開啟頁面切換動畫
    // 禁用狀態也會禁用頁面加載
    enable: true,

    // 路由基本切換動畫
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 是否開啟頁面切換加載
    // 只在enable=true時開啟
    openPageLoading: true,

    // 是否開啟頂部進度條
    openNProgress: false,
  },

  // 是否啟用KeepAlive緩存，在開發時最好關閉，否則需要每次清除緩存
  openKeepAlive: true,

  // 自動鎖屏時間，0表示不鎖屏。單位分鐘，默認0
  lockTime: 0,

  // 是否顯示面包屑
  showBreadCrumb: true,

  // 是否顯示面包屑圖標
  showBreadCrumbIcon: false,

  // 使用error-handler-plugin
  useErrorHandle: false,

  // 是否開啟返回頂部
  useOpenBackTop: true,

  // 是否可以嵌入iframe頁面
  canEmbedIFramePage: true,

  // 切換界面時是否刪除未關閉的消息和通知
  closeMessageOnSwitch: true,

  // 切換界面時是否取消已發送但未響應的http請求
  // 如果啟用，我想單獨設置一個接口。可以在單獨的接口中設置
  removeAllHttpPending: false,
};

export default setting;
