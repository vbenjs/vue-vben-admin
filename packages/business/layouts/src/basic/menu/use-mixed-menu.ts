import type { MenuRecordRaw } from '@vben-core/typings';

import { preference, usePreference } from '@vben/preference';
import { useAccessStore } from '@vben/stores';
import { computed, onBeforeMount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { findRootMenuByPath } from './helper';

function useMixedMenu() {
  const accessStore = useAccessStore();

  const route = useRoute();
  const router = useRouter();
  const splitSideMenus = ref<MenuRecordRaw[]>([]);
  const rootMenuPath = ref<string>('');

  const { isMixedNav } = usePreference();

  const sideVisible = computed(() => {
    if (isMixedNav.value) {
      return preference.sideVisible && splitSideMenus.value.length > 0;
    }
    return preference.sideVisible;
  });
  const menus = computed(() => accessStore.getAccessMenus);

  /**
   * 头部菜单
   */
  const headerMenus = computed(() => {
    if (!isMixedNav.value) {
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
    if (!isMixedNav.value) {
      return menus.value;
    }

    return splitSideMenus.value;
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
    if (!isMixedNav.value) {
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
    if (!isMixedNav.value || mode === 'vertical') {
      router.push(key);
      return;
    }

    const rootMenu = menus.value.find((item) => item.path === key);
    rootMenuPath.value = rootMenu?.path ?? '';
    splitSideMenus.value = rootMenu?.children ?? [];
    if (splitSideMenus.value.length === 0) {
      router.push(key);
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
