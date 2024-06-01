import type { MenuRecordRaw } from '@vben-core/typings';

import { preferences, usePreferences } from '@vben-core/preferences';
import { useAccessStore } from '@vben-core/stores';

import { computed, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

import { findRootMenuByPath } from './helper';
import { useNavigation } from './use-navigation';

function useMixedMenu() {
  const accessStore = useAccessStore();
  const { navigation } = useNavigation();
  const route = useRoute();
  const splitSideMenus = ref<MenuRecordRaw[]>([]);
  const rootMenuPath = ref<string>('');

  const { isMixedNav } = usePreferences();

  const needSplit = computed(
    () => preferences.navigation.split && isMixedNav.value,
  );

  const sideVisible = computed(() => {
    const enableSidebar = preferences.sidebar.enable;
    if (needSplit.value) {
      return enableSidebar && splitSideMenus.value.length > 0;
    }
    return enableSidebar;
  });
  const menus = computed(() => accessStore.getAccessMenus);

  /**
   * 头部菜单
   */
  const headerMenus = computed(() => {
    if (!needSplit.value) {
      return menus.value;
    }
    return menus.value.map((item) => {
      return {
        ...item,
        children: [],
      };
    });
  });

  /**
   * 侧边菜单
   */
  const sideMenus = computed(() => {
    return needSplit.value ? splitSideMenus.value : menus.value;
  });

  /**
   * 侧边菜单激活路径
   */
  const sideActive = computed(() => {
    return route.path;
  });

  /**
   * 头部菜单激活路径
   */
  const headerActive = computed(() => {
    if (!needSplit.value) {
      return route.path;
    }
    return rootMenuPath.value;
  });

  /**
   * 菜单点击事件处理
   * @param key 菜单路径
   * @param mode 菜单模式
   */
  const handleMenuSelect = (key: string, mode?: string) => {
    if (!needSplit.value || mode === 'vertical') {
      navigation(key);
      return;
    }

    const rootMenu = menus.value.find((item) => item.path === key);
    rootMenuPath.value = rootMenu?.path ?? '';
    splitSideMenus.value = rootMenu?.children ?? [];
    if (splitSideMenus.value.length === 0) {
      navigation(key);
    }
  };

  /**
   * 计算侧边菜单
   * @param path 路由路径
   */
  function calcSideMenus(path: string = route.path) {
    let { rootMenu } = findRootMenuByPath(menus.value, path);
    if (!rootMenu) {
      rootMenu = menus.value.find((item) => item.path === path);
    }
    rootMenuPath.value = rootMenu?.path ?? '';
    splitSideMenus.value = rootMenu?.children ?? [];
  }

  // 初始化计算侧边菜单
  onBeforeMount(() => {
    calcSideMenus();
  });

  return {
    handleMenuSelect,
    headerActive,
    headerMenus,
    sideActive,
    sideMenus,
    sideVisible,
  };
}

export { useMixedMenu };
