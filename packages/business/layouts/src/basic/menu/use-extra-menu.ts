import type { MenuRecordRaw } from '@vben-core/typings';

import { preferences } from '@vben-core/preferences';
import { useAccessStore } from '@vben-core/stores';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { findRootMenuByPath } from './helper';
import { useNavigation } from './use-navigation';

function useExtraMenu() {
  const accessStore = useAccessStore();
  const { navigation } = useNavigation();

  const menus = computed(() => accessStore.getAccessMenus);

  const route = useRoute();
  const extraMenus = ref<MenuRecordRaw[]>([]);
  const extraVisible = ref<boolean>(false);
  const extraActiveMenu = ref('');

  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = async (menu: MenuRecordRaw) => {
    extraMenus.value = menu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
    const hasChildren = extraMenus.value.length > 0;

    extraVisible.value = hasChildren;
    if (!hasChildren) {
      await navigation(menu.path);
    }
  };

  /**
   * 选择默认菜单事件
   * @param menu
   * @param rootMenu
   */
  const handleDefaultSelect = (
    menu: MenuRecordRaw,
    rootMenu?: MenuRecordRaw,
  ) => {
    extraMenus.value = rootMenu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;

    if (preferences.sidebar.expandOnHover) {
      extraVisible.value = extraMenus.value.length > 0;
    }
  };

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (preferences.sidebar.expandOnHover) {
      return;
    }
    extraVisible.value = false;

    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
      menus.value,
      route.path,
    );
    extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? '';
    extraMenus.value = rootMenu?.children ?? [];
  };

  const handleMenuMouseEnter = (menu: MenuRecordRaw) => {
    if (!preferences.sidebar.expandOnHover) {
      const { findMenu } = findRootMenuByPath(menus.value, menu.path);
      extraMenus.value = findMenu?.children ?? [];
      extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
      extraVisible.value = extraMenus.value.length > 0;
    }
  };

  return {
    extraActiveMenu,
    extraMenus,
    extraVisible,
    handleDefaultSelect,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
  };
}

export { useExtraMenu };
