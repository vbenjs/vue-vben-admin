import { ContentEnum, RouterTransitionEnum } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TopMenuAlignEnum, TriggerEnum } from '/@/enums/menuEnum';

import mixImg from '/@/assets/images/layout/menu-mix.svg';
import sidebarImg from '/@/assets/images/layout/menu-sidebar.svg';
import menuTopImg from '/@/assets/images/layout/menu-top.svg';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n('layout.setting');

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

  LOCK_TIME,
  FULL_CONTENT,
  CONTENT_MODE,
  SHOW_BREADCRUMB,
  SHOW_BREADCRUMB_ICON,
  GRAY_MODE,
  COLOR_WEAK,
  SHOW_LOGO,
  SHOW_FOOTER,

  ROUTER_TRANSITION,
  OPEN_PROGRESS,
  OPEN_PAGE_LOADING,
  OPEN_ROUTE_TRANSITION,
}

export const contentModeOptions = [
  {
    value: ContentEnum.FULL,
    label: t('contentModeFull'),
  },
  {
    value: ContentEnum.FIXED,
    label: t('contentModeFixed'),
  },
];

export const topMenuAlignOptions = [
  {
    value: TopMenuAlignEnum.CENTER,
    label: t('topMenuAlignRight'),
  },
  {
    value: TopMenuAlignEnum.START,
    label: t('topMenuAlignLeft'),
  },
  {
    value: TopMenuAlignEnum.END,
    label: t('topMenuAlignCenter'),
  },
];

export const menuTriggerOptions = [
  {
    value: TriggerEnum.NONE,
    label: t('menuTriggerNone'),
  },
  {
    value: TriggerEnum.FOOTER,
    label: t('menuTriggerBottom'),
  },
  {
    value: TriggerEnum.HEADER,
    label: t('menuTriggerTop'),
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
    title: t('menuTypeSidebar'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.SIDEBAR,
    src: sidebarImg,
  },
  {
    title: t('menuTypeMix'),
    mode: MenuModeEnum.INLINE,
    type: MenuTypeEnum.MIX,
    src: mixImg,
  },

  {
    title: t('menuTypeTopMenu'),
    mode: MenuModeEnum.HORIZONTAL,
    type: MenuTypeEnum.TOP_MENU,
    src: menuTopImg,
  },
];
