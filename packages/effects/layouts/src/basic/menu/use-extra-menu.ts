import type { MenuRecordRaw } from '@vben/types';

import { computed, nextTick, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { findRootMenuByPath } from '@vben/utils';

import { useNavigation } from './use-navigation';

function useExtraMenu() {
  const accessStore = useAccessStore();
  const { navigation } = useNavigation();

  const menus = computed(() => accessStore.accessMenus);

  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>();
  const extraRootMenus = ref<MenuRecordRaw[]>([]);
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
    } else if (preferences.sidebar.autoActivateChild) {
      await navigation(
        defaultSubMap.has(menu.path)
          ? (defaultSubMap.get(menu.path) as string)
          : menu.path,
      );
    }
  };

  /**
   * 选择默认菜单事件
   * @param menu
   * @param rootMenu
   */
  const handleDefaultSelect = async (
    menu: MenuRecordRaw,
    rootMenu?: MenuRecordRaw,
  ) => {
    await nextTick();

    extraMenus.value = rootMenu?.children ?? extraRootMenus.value ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;

    if (preferences.sidebar.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    // const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
    //   menus.value,
    //   route.path,
    // );
    calcExtraMenus(route.path);
    if (preferences.sidebar.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0;
      return;
    }
    sidebarExtraVisible.value = false;
  };

  const handleMenuMouseEnter = (menu: MenuRecordRaw) => {
    if (!preferences.sidebar.expandOnHover) {
      const { findMenu } = findRootMenuByPath(menus.value, menu.path);
      extraMenus.value = findMenu?.children ?? [];
      extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  function calcExtraMenus(path: string) {
    const currentPath = route.meta?.activePath || path;
    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
      menus.value,
      currentPath,
    );
    if (preferences.app.layout === 'header-mixed-nav') {
      const subExtra = findRootMenuByPath(
        rootMenu?.children ?? [],
        currentPath,
        1,
      );
      extraRootMenus.value = subExtra.rootMenu?.children ?? [];
      extraActiveMenu.value = subExtra.rootMenuPath ?? '';
      extraMenus.value = subExtra.rootMenu?.children ?? [];
    } else {
      extraRootMenus.value = rootMenu?.children ?? [];
      if (rootMenuPath) defaultSubMap.set(rootMenuPath, currentPath);
      extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? '';
      extraMenus.value = rootMenu?.children ?? [];
    }
    if (preferences.sidebar.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  }

  watch(
    () => [route.path, preferences.app.layout],
    ([path]) => {
      calcExtraMenus(path || '');
    },
    { immediate: true },
  );

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
