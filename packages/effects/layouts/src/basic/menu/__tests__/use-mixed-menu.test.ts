import type { App } from 'vue';

import type { MenuRecordRaw } from '@vben/types';

import { createApp, nextTick, reactive } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import { useMixedMenu } from '../use-mixed-menu';

vi.mock('@vben/preferences', async () => {
  const { ref } = await import('vue');
  return {
    preferences: {
      navigation: { split: true },
      sidebar: { autoActivateChild: false, enable: true },
    },
    usePreferences: () => ({
      isHeaderMixedNav: ref(false),
      isMixedNav: ref(true),
      isMobile: ref(false),
    }),
  };
});

const routeHolder = vi.hoisted(() => ({
  current: { meta: {} as Record<string, unknown>, path: '/' },
}));

vi.mock('vue-router', () => ({
  useRoute: () => routeHolder.current,
}));

const storeHolder = vi.hoisted(() => ({
  accessMenus: [] as MenuRecordRaw[],
}));

vi.mock('@vben/stores', () => ({
  useAccessStore: () => storeHolder,
}));

vi.mock('../use-navigation', () => ({
  useNavigation: () => ({
    navigation: vi.fn(),
    willOpenedByWindow: () => false,
  }),
}));

// 与 generateMenus 的产物一致：一级菜单没有 parents，只有子菜单带 parent/parents。
function createMenus(): MenuRecordRaw[] {
  return [
    {
      name: '系统管理',
      path: '/system',
      children: [
        {
          name: '用户管理',
          path: '/system/user',
          parent: '/system',
          parents: ['/system'],
          children: [],
        },
      ],
    },
  ];
}

let activeApp: App | undefined;

function setRoute(path: string, meta: Record<string, unknown> = {}) {
  routeHolder.current = reactive({ meta, path });
}

function mountMixedMenu() {
  const holder: { api?: ReturnType<typeof useMixedMenu> } = {};
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp({
    setup() {
      holder.api = useMixedMenu();
      return () => null;
    },
  });
  activeApp.mount(host);
  if (!holder.api) {
    throw new Error('useMixedMenu was not mounted');
  }
  return holder.api;
}

function cleanup() {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  routeHolder.current.path = '/';
  routeHolder.current.meta = {};
}

describe('useMixedMenu', () => {
  it('在非菜单页面（如用户下拉里的 /profile）保留当前侧边菜单', async () => {
    try {
      storeHolder.accessMenus = createMenus();
      setRoute('/system/user');
      const api = mountMixedMenu();

      await nextTick();
      expect(api.sidebarVisible.value).toBe(true);
      expect(api.sidebarMenus.value).toHaveLength(1);
      expect(api.headerActive.value).toBe('/system');

      // 侧边栏消失的真实用户路径：从用户下拉进入内置的 /profile（hideInMenu）。
      routeHolder.current.path = '/profile';
      await nextTick();

      expect(api.sidebarVisible.value).toBe(true);
      expect(api.sidebarMenus.value).toHaveLength(1);
      expect(api.headerActive.value).toBe('/system');
    } finally {
      cleanup();
    }
  });

  it('仍然能切换到另一个一级菜单的侧边菜单', async () => {
    try {
      storeHolder.accessMenus = [
        ...createMenus(),
        {
          name: '演示',
          path: '/demos',
          children: [
            {
              name: '示例',
              path: '/demos/example',
              parent: '/demos',
              parents: ['/demos'],
              children: [],
            },
          ],
        },
      ];
      setRoute('/system/user');
      const api = mountMixedMenu();
      await nextTick();

      routeHolder.current.path = '/demos/example';
      await nextTick();

      expect(api.headerActive.value).toBe('/demos');
      expect(api.sidebarMenus.value[0]?.path).toBe('/demos/example');
    } finally {
      cleanup();
    }
  });
});
