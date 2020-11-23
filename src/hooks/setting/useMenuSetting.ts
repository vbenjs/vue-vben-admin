import type { MenuSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
import { MenuModeEnum, MenuTypeEnum, TriggerEnum } from '/@/enums/menuEnum';

export function useMenuSetting() {
  // Get menu configuration
  const getMenuSetting = computed(() => appStore.getProjectConfig.menuSetting);

  const getMiniWidth = computed(() => unref(getMenuSetting).menuWidth);

  const getCollapsed = computed(() => unref(getMenuSetting).collapsed);

  const getType = computed(() => unref(getMenuSetting).type);

  const getMode = computed(() => unref(getMenuSetting).mode);

  const getShow = computed(() => unref(getMenuSetting).show);

  const getMenuWidth = computed(() => unref(getMenuSetting).menuWidth);

  const getTrigger = computed(() => unref(getMenuSetting).trigger);

  const getTheme = computed(() => unref(getMenuSetting).theme);

  const getSplit = computed(() => unref(getMenuSetting).split);

  const getHasDrag = computed(() => unref(getMenuSetting).hasDrag);

  const getAccordion = computed(() => unref(getMenuSetting).accordion);

  const getCollapsedShowTitle = computed(() => unref(getMenuSetting).collapsedShowTitle);

  const getCollapsedShowSearch = computed(() => unref(getMenuSetting).collapsedShowSearch);

  const getTopMenuAlign = computed(() => unref(getMenuSetting).topMenuAlign);

  const getIsSidebarType = computed(() => unref(getType) === MenuTypeEnum.SIDEBAR);

  const getShowTopMenu = computed(() => {
    return unref(getMode) === MenuModeEnum.HORIZONTAL || unref(getSplit);
  });

  const getShowHeaderTrigger = computed(() => {
    if (
      unref(getType) === MenuTypeEnum.TOP_MENU ||
      !unref(getShow) ||
      !unref(getMenuSetting).hidden
    ) {
      return false;
    }

    return unref(getTrigger) === TriggerEnum.HEADER;
  });

  const getShowSearch = computed(() => {
    return (
      unref(getMenuSetting).showSearch &&
      !(unref(getType) === MenuTypeEnum.MIX && unref(getMode) === MenuModeEnum.HORIZONTAL)
    );
  });

  const getIsHorizontal = computed(() => {
    return unref(getMode) === MenuModeEnum.HORIZONTAL;
  });

  const getMiniWidthNumber = computed(() => {
    const { collapsedShowTitle } = unref(getMenuSetting);
    return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
  });

  const getCalcContentWidth = computed(() => {
    const width = unref(getCollapsed) ? unref(getMiniWidthNumber) : unref(getMiniWidth);
    return `calc(100% - ${width}px)`;
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

  return {
    setMenuSetting,

    toggleCollapsed,

    getMenuSetting,
    getMiniWidth,
    getType,
    getMode,
    getShow,
    getCollapsed,
    getMiniWidthNumber,
    getCalcContentWidth,
    getMenuWidth,
    getTrigger,
    getSplit,
    getTheme,
    getHasDrag,
    getIsHorizontal,
    getShowSearch,
    getCollapsedShowTitle,
    getCollapsedShowSearch,
    getIsSidebarType,
    getAccordion,
    getShowTopMenu,
    getShowHeaderTrigger,
    getTopMenuAlign,
  };
}
