import { ContentEnum, RouterTransitionEnum, ThemeEnum } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TopMenuAlignEnum, TriggerEnum } from '/@/enums/menuEnum';

import mixImg from '/@/assets/images/layout/menu-mix.svg';
import sidebarImg from '/@/assets/images/layout/menu-sidebar.svg';
import menuTopImg from '/@/assets/images/layout/menu-top.svg';

export enum HandlerEnum {
  CHANGE_LAYOUT,
  // menu
  MENU_HAS_DRAG,
  MENU_ACCORDION,
  MENU_TRIGGER,
  MENU_TOP_ALIGN,
  MENU_COLLAPSED,
  MENU_COLLAPSED_SHOW_TITLE,
  MENU_WIDTH,
  MENU_SHOW_SIDEBAR,
  MENU_THEME,
  MENU_SPLIT,
  MENU_SHOW_SEARCH,
  MENU_FIXED,

  // header
  HEADER_SHOW,
  HEADER_THEME,
  HEADER_FIXED,

  TABS_SHOW_QUICK,
  TABS_SHOW,

  OPEN_PAGE_LOADING,
  OPEN_ROUTE_TRANSITION,
  ROUTER_TRANSITION,
  LOCK_TIME,
  FULL_CONTENT,
  CONTENT_MODE,
  SHOW_BREADCRUMB,
  SHOW_BREADCRUMB_ICON,
  GRAY_MODE,
  COLOR_WEAK,
  SHOW_LOGO,
  SHOW_FOOTER,
}

export const themeOptions = [
  {
    value: ThemeEnum.LIGHT,
    label: '亮色',
  },
  {
    value: ThemeEnum.DARK,
    label: '暗色',
  },
];

export const contentModeOptions = [
  {
    value: ContentEnum.FULL,
    label: '流式',
  },
  {
    value: ContentEnum.FIXED,
    label: '定宽',
  },
];

export const topMenuAlignOptions = [
  {
    value: TopMenuAlignEnum.CENTER,
    label: '居中',
  },
  {
    value: TopMenuAlignEnum.START,
    label: '居左',
  },
  {
    value: TopMenuAlignEnum.END,
    label: '居右',
  },
];

export const menuTriggerOptions = [
  {
    value: TriggerEnum.NONE,
    label: '不显示',
  },
  {
    value: TriggerEnum.FOOTER,
    label: '底部',
  },
  {
    value: TriggerEnum.HEADER,
    label: '顶部',
  },
];

export const routerTransitionOptions = [
  RouterTransitionEnum.ZOOM_FADE,
  RouterTransitionEnum.FADE,
  RouterTransitionEnum.ZOOM_OUT,
  RouterTransitionEnum.FADE_SIDE,
  RouterTransitionEnum.FADE_BOTTOM,
].map((item) => {
  return {
    label: item,
    value: item,
  };
});

export const menuTypeList = [
  {
    title: '左侧菜单模式',
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
    src: sidebarImg,
  },
  {
    title: '混合模式',
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
    src: mixImg,
  },

  {
    title: '顶部菜单模式',
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
    src: menuTopImg,
  },
];
