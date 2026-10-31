import type { App } from 'vue';

import type { MenuRecordRaw } from '@vben/types';

import { createApp, nextTick, reactive } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import { useExtraMenu } from '../use-extra-menu';

vi.mock('@vben/preferences', () => ({
  preferences: {
    app: { layout: 'sidebar-mixed-nav' },
    sidebar: { expandOnHover: false },
  },
}));

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

function mountExtraMenu() {
  const holder: { api?: ReturnType<typeof useExtraMenu> } = {};
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp({
    setup() {
      holder.api = useExtraMenu();
      return () => null;
    },
  });
  activeApp.mount(host);
  if (!holder.api) {
    throw new Error('useExtraMenu was not mounted');
  }
  return holder.api;
}

function cleanup() {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  routeHolder.current = { meta: {}, path: '/' };
}

describe('useExtraMenu on routes outside the menu tree', () => {
  it('在非菜单页面（如 /profile）保留当前二级菜单', async () => {
    try {
      storeHolder.accessMenus = createMenus();
      setRoute('/system/user');
      const api = mountExtraMenu();
      await nextTick();

      expect(api.extraMenus.value).toHaveLength(1);
      expect(api.sidebarExtraVisible.value).toBe(true);
      expect(api.extraActiveMenu.value).toBe('/system');

      routeHolder.current.path = '/profile';
      await nextTick();

      expect(api.extraMenus.value).toHaveLength(1);
      expect(api.sidebarExtraVisible.value).toBe(true);
      expect(api.extraActiveMenu.value).toBe('/system');
    } finally {
      cleanup();
    }
  });

  it('仍然能切换到另一个一级菜单的二级菜单', async () => {
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
      const api = mountExtraMenu();
      await nextTick();

      routeHolder.current.path = '/demos/example';
      await nextTick();

      expect(api.extraActiveMenu.value).toBe('/demos');
      expect(api.extraMenus.value[0]?.path).toBe('/demos/example');
    } finally {
      cleanup();
    }
  });

  it('在非菜单页面悬停其它分区后移出侧边栏时恢复上次匹配的分区', async () => {
    try {
      const demosRoot: MenuRecordRaw = {
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
      };
      storeHolder.accessMenus = [...createMenus(), demosRoot];
      setRoute('/system/user');
      const api = mountExtraMenu();
      await nextTick();

      routeHolder.current.path = '/profile';
      await nextTick();
      expect(api.extraActiveMenu.value).toBe('/system');

      api.handleMenuMouseEnter(demosRoot);
      await nextTick();
      expect(api.extraActiveMenu.value).toBe('/demos');

      api.handleSideMouseLeave();
      await nextTick();

      expect(api.extraActiveMenu.value).toBe('/system');
      expect(api.extraMenus.value[0]?.path).toBe('/system/user');
    } finally {
      cleanup();
    }
  });
});
