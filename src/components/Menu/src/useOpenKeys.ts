import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';
import type { Ref } from 'vue';

import { unref } from 'vue';
import { menuStore } from '/@/store/modules/menu';
import { getAllParentPath } from '/@/utils/helper/menuHelper';

export function useOpenKeys(
  menuState: MenuState,
  menus: Ref<MenuType[]>,
  flatMenusRef: Ref<MenuType[]>,
  isAppMenu: Ref<boolean>
) {
  /**
   * @description:设置展开
   */
  function setOpenKeys(menu: MenuType) {
    const flatMenus = unref(flatMenusRef);
    menuState.openKeys = getAllParentPath(flatMenus, menu.path);
  }
  /**
   * @description:  重置值
   */
  function resetKeys() {
    menuState.selectedKeys = [];
    menuState.openKeys = [];
  }

  function handleOpenChange(openKeys: string[]) {
    const rootSubMenuKeys: string[] = [];
    for (const { children, path } of unref(menus)) {
      if (children && children.length > 0) {
        rootSubMenuKeys.push(path);
      }
    }
    if (!menuStore.getCollapsedState || !unref(isAppMenu)) {
      const latestOpenKey = openKeys.find((key) => menuState.openKeys.indexOf(key) === -1);
      if (rootSubMenuKeys.indexOf(latestOpenKey as string) === -1) {
        menuState.openKeys = openKeys;
      } else {
        menuState.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    } else {
      menuState.collapsedOpenKeys = openKeys;
    }
  }
  return { setOpenKeys, resetKeys, handleOpenChange };
}
