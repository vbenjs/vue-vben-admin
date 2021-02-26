import type { MenuSetting } from '/#/config';

import { computed, unref, ref } from 'vue';

import { appStore } from '/@/store/modules/app';

import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';
import { useFullContent } from '/@/hooks/web/useFullContent';

const mixSideHasChildren = ref(false);

// Get menu configuration
const getMenuSetting = computed(() => appStore.getProjectConfig.menuSetting);

const getCollapsed = computed(() => unref(getMenuSetting).collapsed);

const getMenuType = computed(() => unref(getMenuSetting).type);

const getMenuMode = computed(() => unref(getMenuSetting).mode);

const getMenuFixed = computed(() => unref(getMenuSetting).fixed);

const getShowMenu = computed(() => unref(getMenuSetting).show);

const getMenuHidden = computed(() => unref(getMenuSetting).hidden);

const getMenuWidth = computed(() => unref(getMenuSetting).menuWidth);

const getTrigger = computed(() => unref(getMenuSetting).trigger);

const getMenuTheme = computed(() => unref(getMenuSetting).theme);

const getSplit = computed(() => unref(getMenuSetting).split);

const getMenuBgColor = computed(() => unref(getMenuSetting).bgColor);

const getMixSideTrigger = computed(() => unref(getMenuSetting).mixSideTrigger);

const getCanDrag = computed(() => unref(getMenuSetting).canDrag);

const getAccordion = computed(() => unref(getMenuSetting).accordion);

const getMixSideFixed = computed(() => unref(getMenuSetting).mixSideFixed);

const getTopMenuAlign = computed(() => unref(getMenuSetting).topMenuAlign);

const getCloseMixSidebarOnChange = computed(() => unref(getMenuSetting).closeMixSidebarOnChange);

const getIsSidebarType = computed(() => unref(getMenuType) === MenuTypeEnum.SIDEBAR);

const getIsTopMenu = computed(() => unref(getMenuType) === MenuTypeEnum.TOP_MENU);

const getCollapsedShowTitle = computed(() => unref(getMenuSetting).collapsedShowTitle);

const getShowTopMenu = computed(() => {
  return unref(getMenuMode) === MenuModeEnum.HORIZONTAL || unref(getSplit);
});

const getShowHeaderTrigger = computed(() => {
  if (unref(getMenuType) === MenuTypeEnum.TOP_MENU || !unref(getShowMenu) || unref(getMenuHidden)) {
    return false;
  }

  return unref(getTrigger) === TriggerEnum.HEADER;
});

const getIsHorizontal = computed(() => {
  return unref(getMenuMode) === MenuModeEnum.HORIZONTAL;
});

const getIsMixSidebar = computed(() => {
  return unref(getMenuType) === MenuTypeEnum.MIX_SIDEBAR;
});

const getIsMixMode = computed(() => {
  return unref(getMenuMode) === MenuModeEnum.INLINE && unref(getMenuType) === MenuTypeEnum.MIX;
});

const getRealWidth = computed(() => {
  if (unref(getIsMixSidebar)) {
    return unref(getCollapsed) && !unref(getMixSideFixed)
      ? unref(getMiniWidthNumber)
      : unref(getMenuWidth);
  }
  return unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMenuWidth);
});

const getMiniWidthNumber = computed(() => {
  const { collapsedShowTitle } = unref(getMenuSetting);
  return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
});

const getCalcContentWidth = computed(() => {
  const width =
    unref(getIsTopMenu) || !unref(getShowMenu) || (unref(getSplit) && unref(getMenuHidden))
      ? 0
      : unref(getIsMixSidebar)
      ? (unref(getCollapsed) ? SIDE_BAR_MINI_WIDTH : SIDE_BAR_SHOW_TIT_MINI_WIDTH) +
        (unref(getMixSideFixed) && unref(mixSideHasChildren) ? unref(getRealWidth) : 0)
      : unref(getRealWidth);

  return `calc(100% - ${unref(width)}px)`;
});

const { getFullContent: fullContent } = useFullContent();

const getShowSidebar = computed(() => {
  return (
    unref(getSplit) ||
    (unref(getShowMenu) && unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && !unref(fullContent))
  );
});

// Set menu configuration
function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
  appStore.commitProjectConfigState({ menuSetting });
}

function toggleCollapsed() {
  setMenuSetting({
    collapsed: !unref(getCollapsed),
  });
}

export function useMenuSetting() {
  return {
    setMenuSetting,

    toggleCollapsed,

    getMenuFixed,
    getMenuSetting,
    getRealWidth,
    getMenuType,
    getMenuMode,
    getShowMenu,
    getCollapsed,
    getMiniWidthNumber,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getMenuTheme,
    getCanDrag,
    getCollapsedShowTitle,
    getIsHorizontal,
    getIsSidebarType,
    getAccordion,
    getShowTopMenu,
    getShowHeaderTrigger,
    getTopMenuAlign,
    getMenuHidden,
    getIsTopMenu,
    getMenuBgColor,
    getShowSidebar,
    getIsMixMode,
    getIsMixSidebar,
    getCloseMixSidebarOnChange,
    getMixSideTrigger,
    getMixSideFixed,
    mixSideHasChildren,
  };
}
