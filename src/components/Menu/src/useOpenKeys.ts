import { MenuModeEnum } from '/@/enums/menuEnum';
import type { Menu as MenuType } from '/@/router/types';
import type { MenuState } from './types';

import { computed, Ref, toRaw } from 'vue';

import { unref } from 'vue';
import { es6Unique } from '/@/utils';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { getAllParentPath } from '/@/router/helper/menuHelper';

export function useOpenKeys(
  menuState: MenuState,
  menus: Ref<MenuType[]>,
  mode: Ref<MenuModeEnum>,
  accordion: Ref<boolean>
) {
  const { getCollapsed } = useMenuSetting();

  function setOpenKeys(path: string) {
    const menuList = toRaw(menus.value);
    if (!unref(accordion)) {
      menuState.openKeys = es6Unique([...menuState.openKeys, ...getAllParentPath(menuList, path)]);
    } else {
      menuState.openKeys = getAllParentPath(menuList, path);
    }
  }

  const getOpenKeys = computed(() => {
    return unref(getCollapsed) ? menuState.collapsedOpenKeys : menuState.openKeys;
  });

  /**
   * @description:  重置值
   */
  function resetKeys() {
    menuState.selectedKeys = [];
    menuState.openKeys = [];
  }

  function handleOpenChange(openKeys: string[]) {
    if (unref(mode) === MenuModeEnum.HORIZONTAL || !unref(accordion)) {
      menuState.openKeys = openKeys;
    } else {
      // const menuList = toRaw(menus.value);
      // getAllParentPath(menuList, path);
      const rootSubMenuKeys: string[] = [];
      for (const { children, path } of unref(menus)) {
        if (children && children.length > 0) {
          rootSubMenuKeys.push(path);
        }
      }
      if (!unref(getCollapsed)) {
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
  }
  return { setOpenKeys, resetKeys, getOpenKeys, handleOpenChange };
}
