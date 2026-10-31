import type { MenuRecordRaw } from '@vben/types';

import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { findRootMenuByPath } from '@vben/utils';

import { useNavigation } from './use-navigation';

function useMixedMenu() {
  const { navigation, willOpenedByWindow } = useNavigation();
  const accessStore = useAccessStore();
  const route = useRoute();
  const splitSideMenus = ref<MenuRecordRaw[]>([]);
  const rootMenuPath = ref<string>('');
  const mixedRootMenuPath = ref<string>('');
  const mixExtraMenus = ref<MenuRecordRaw[]>([]);
  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>();
  const { isMixedNav, isHeaderMixedNav, isMobile } = usePreferences();

  const needSplit = computed(
    () =>
      !isMobile.value &&
      ((preferences.navigation.split && isMixedNav.value) ||
        isHeaderMixedNav.value),
  );

  const sidebarVisible = computed(() => {
    const enableSidebar = preferences.sidebar.enable;
    if (needSplit.value) {
      return enableSidebar && splitSideMenus.value.length > 0;
    }
    return enableSidebar;
  });
  const menus = computed(() => accessStore.accessMenus);

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
  const sidebarMenus = computed(() => {
    return needSplit.value ? splitSideMenus.value : menus.value;
  });

  const mixHeaderMenus = computed(() => {
    return isHeaderMixedNav.value ? sidebarMenus.value : headerMenus.value;
  });

  /**
   * 侧边菜单激活路径
   */
  const sidebarActive = computed(() => {
    return (route?.meta?.activePath as string) ?? route.path;
  });

  /**
   * 头部菜单激活路径
   */
  const headerActive = computed(() => {
    if (!needSplit.value) {
      return route.meta?.activePath ?? route.path;
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
    const _splitSideMenus = rootMenu?.children ?? [];

    if (!willOpenedByWindow(key)) {
      rootMenuPath.value = rootMenu?.path ?? '';
      splitSideMenus.value = _splitSideMenus;
    }

    if (_splitSideMenus.length === 0) {
      navigation(key);
    } else if (rootMenu && preferences.sidebar.autoActivateChild) {
      navigation(
        defaultSubMap.has(rootMenu.path)
          ? (defaultSubMap.get(rootMenu.path) as string)
          : rootMenu.path,
      );
    }
  };

  /**
   * 侧边菜单展开事件
   * @param key 路由路径
   * @param parentsPath 父级路径
   */
  const handleMenuOpen = (key: string, parentsPath: string[]) => {
    if (parentsPath.length <= 1 && preferences.sidebar.autoActivateChild) {
      navigation(
        defaultSubMap.has(key) ? (defaultSubMap.get(key) as string) : key,
      );
    }
  };

  /**
   * 计算侧边菜单
   * @param path 路由路径
   * @returns 当前路径是否命中菜单树
   */
  function calcSideMenus(path: string = route.path): boolean {
    let { rootMenu } = findRootMenuByPath(menus.value, path);
    if (!rootMenu) {
      rootMenu = menus.value.find((item) => item.path === path);
    }
    if (!rootMenu) {
      // 当前路由不在菜单树里（例如用户下拉进入的 /profile）：保留上一次的侧边菜单，
      // 否则混合布局的侧边栏会整体消失。
      return false;
    }
    const result = findRootMenuByPath(rootMenu.children || [], path, 1);
    mixedRootMenuPath.value = result.rootMenuPath ?? '';
    mixExtraMenus.value = result.rootMenu?.children ?? [];
    rootMenuPath.value = rootMenu.path;
    splitSideMenus.value = rootMenu.children ?? [];
    return true;
  }

  watch(
    () => route.path,
    (path) => {
      const currentPath = route?.meta?.activePath ?? route?.meta?.link ?? path;
      if (willOpenedByWindow(currentPath)) {
        return;
      }
      // 未命中菜单的路径不能记进 defaultSubMap，否则 autoActivateChild 会把菜单外的页面当成默认子页。
      if (calcSideMenus(currentPath) && rootMenuPath.value) {
        defaultSubMap.set(rootMenuPath.value, currentPath);
      }
    },
    { immediate: true },
  );

  // 初始化计算侧边菜单
  onBeforeMount(() => {
    calcSideMenus(route.meta?.activePath || route.path);
  });

  return {
    handleMenuSelect,
    handleMenuOpen,
    headerActive,
    headerMenus,
    sidebarActive,
    sidebarMenus,
    mixHeaderMenus,
    mixExtraMenus,
    sidebarVisible,
  };
}

export { useMixedMenu };
