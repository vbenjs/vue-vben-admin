import type { MenuRecordRaw } from '@vben-core/typings';

import { preference } from '@vben/preference';
import { useAccessStore } from '@vben/stores';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { findRootMenuByPath } from './helper';

function useExtraMenu() {
  const accessStore = useAccessStore();

  const menus = computed(() => accessStore.getAccessMenus);

  const route = useRoute();
  const router = useRouter();
  const extraMenus = ref<MenuRecordRaw[]>([]);
  const extraVisible = ref<boolean>(false);
  const extraActiveMenu = ref('');

  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = (menu: MenuRecordRaw) => {
    extraMenus.value = menu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
    const hasChildren = extraMenus.value.length > 0;

    extraVisible.value = hasChildren;
    if (!hasChildren) {
      router.push(menu.path);
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

    if (preference.sideExpandOnHover) {
      extraVisible.value = extraMenus.value.length > 0;
    }
  };

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (preference.sideExpandOnHover) {
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
    if (!preference.sideExpandOnHover) {
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
