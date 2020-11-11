import { HandlerEnum } from './const';
// import { MenuThemeEnum, MenuTypeEnum } from '/@/enums/menuEnum';
import {
  updateColorWeak,
  updateGrayMode,
  updateHeaderBgColor,
  updateSidebarBgColor,
} from '/@/setup/theme';
import { appStore } from '/@/store/modules/app';
import { ProjectConfig } from '/@/types/config';

export function baseHandler(event: HandlerEnum, value: any) {
  const config = handler(event, value);
  appStore.commitProjectConfigState(config);
}

export function handler(event: HandlerEnum, value: any): DeepPartial<ProjectConfig> {
  switch (event) {
    case HandlerEnum.CHANGE_LAYOUT:
      const { mode, type, split } = value;
      const splitOpt = split === undefined ? { split } : {};
      // let headerSetting = {};
      // if (type === MenuTypeEnum.TOP_MENU) {
      //   headerSetting = {
      //     theme: MenuThemeEnum.DARK,
      //   };
      // }
      return {
        menuSetting: {
          mode,
          type,
          collapsed: false,
          show: true,
          ...splitOpt,
        },
        // headerSetting,
      };

    case HandlerEnum.MENU_HAS_DRAG:
      return {
        menuSetting: {
          hasDrag: value,
        },
      };

    case HandlerEnum.MENU_ACCORDION:
      return {
        menuSetting: {
          accordion: value,
        },
      };
    case HandlerEnum.MENU_TRIGGER:
      return {
        menuSetting: {
          trigger: value,
        },
      };
    case HandlerEnum.MENU_TOP_ALIGN:
      return {
        menuSetting: {
          topMenuAlign: value,
        },
      };
    case HandlerEnum.MENU_COLLAPSED:
      return {
        menuSetting: {
          collapsed: value,
        },
      };
    case HandlerEnum.MENU_WIDTH:
      return {
        menuSetting: {
          menuWidth: value,
        },
      };
    case HandlerEnum.MENU_COLLAPSED_SHOW_TITLE:
      return {
        menuSetting: {
          collapsedShowTitle: value,
        },
      };
    case HandlerEnum.MENU_SHOW_SIDEBAR:
      return {
        menuSetting: {
          show: value,
        },
      };
    case HandlerEnum.MENU_THEME:
      updateSidebarBgColor(value);
      return {
        menuBgColor: value,
        // menuSetting: {
        //   theme: value,
        // },
      };
    case HandlerEnum.MENU_SPLIT:
      return {
        menuSetting: {
          split: value,
        },
      };
    case HandlerEnum.MENU_SHOW_SEARCH:
      return {
        menuSetting: {
          showSearch: value,
        },
      };
    case HandlerEnum.OPEN_PAGE_LOADING:
      return {
        openPageLoading: value,
      };
    case HandlerEnum.OPEN_ROUTE_TRANSITION:
      return {
        openRouterTransition: value,
      };
    case HandlerEnum.ROUTER_TRANSITION:
      return {
        routerTransition: value,
      };
    case HandlerEnum.LOCK_TIME:
      return {
        lockTime: value,
      };
    case HandlerEnum.FULL_CONTENT:
      return {
        fullContent: value,
      };
    case HandlerEnum.CONTENT_MODE:
      return {
        contentMode: value,
      };
    case HandlerEnum.SHOW_BREADCRUMB:
      return {
        showBreadCrumb: value,
      };
    case HandlerEnum.SHOW_BREADCRUMB_ICON:
      return {
        showBreadCrumbIcon: value,
      };
    case HandlerEnum.GRAY_MODE:
      updateGrayMode(value);
      return {
        grayMode: value,
      };
    case HandlerEnum.COLOR_WEAK:
      updateColorWeak(value);
      return {
        colorWeak: value,
      };
    case HandlerEnum.SHOW_LOGO:
      return {
        showLogo: value,
      };
    case HandlerEnum.TABS_SHOW_QUICK:
      return {
        multiTabsSetting: {
          showQuick: value,
        },
      };
    case HandlerEnum.TABS_SHOW_ICON:
      return {
        multiTabsSetting: {
          showIcon: value,
        },
      };
    case HandlerEnum.TABS_SHOW:
      return {
        multiTabsSetting: {
          show: value,
        },
      };
    case HandlerEnum.HEADER_THEME:
      updateHeaderBgColor(value);
      return {
        headerBgColor: value,
      };
    case HandlerEnum.HEADER_FIXED:
      return {
        headerSetting: {
          fixed: value,
        },
      };
    case HandlerEnum.HEADER_SHOW:
      return {
        headerSetting: {
          show: value,
        },
      };
    default:
      return {};
  }
}
