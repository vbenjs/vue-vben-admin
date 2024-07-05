import type { MenuRecordRaw } from '@vben-core/typings';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { findRootMenuByPath } from '@vben-core/helpers';
import { preferences } from '@vben-core/preferences';
import { useCoreAccessStore } from '@vben-core/stores';

import { useNavigation } from './use-navigation';

function useExtraMenu() {
  const accessStore = useCoreAccessStore();
  const { navigation } = useNavigation();

  const menus = computed(() => accessStore.getAccessMenus);

  const route = useRoute();
  const extraMenus = ref<MenuRecordRaw[]>([]);
  const sidebarExtraVisible = ref<boolean>(false);
  const extraActiveMenu = ref('');

  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = async (menu: MenuRecordRaw) => {
    extraMenus.value = menu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
    const hasChildren = extraMenus.value.length > 0;

    sidebarExtraVisible.value = hasChildren;
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
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (preferences.sidebar.expandOnHover) {
      return;
    }
    sidebarExtraVisible.value = false;

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
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  return {
    extraActiveMenu,
    extraMenus,
    handleDefaultSelect,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    sidebarExtraVisible,
  };
}

export { useExtraMenu };
