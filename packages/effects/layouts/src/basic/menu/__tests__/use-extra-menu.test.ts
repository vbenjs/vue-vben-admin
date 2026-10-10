import type { App } from 'vue';

import type { MenuRecordRaw } from '@vben/types';

import { computed, createApp } from 'vue';

import { describe, expect, it, vi } from 'vitest';

import { useExtraMenu } from '../use-extra-menu';

// preferences 是模块级单例，测试里用可变 mock 控制布局与展开行为
const mockPreferences = vi.hoisted(() => ({
  app: { layout: 'sidebar-mixed-nav' },
  sidebar: { expandOnHover: true },
}));

vi.mock('@vben/preferences', () => ({
  preferences: mockPreferences,
}));

// useRoute 从实例注入取路由，测试里用 holder 直接供给
const routeHolder = vi.hoisted(() => ({
  current: {
    meta: {},
    path: '/',
  } as { meta: Record<string, unknown>; path: string },
}));

vi.mock('vue-router', () => ({
  useRoute: () => routeHolder.current,
}));

vi.mock('@vben/stores', () => ({
  useAccessStore: () => ({ accessMenus: [] }),
}));

vi.mock('../use-navigation', () => ({
  useNavigation: () => ({
    navigation: vi.fn(),
    willOpenedByWindow: () => false,
  }),
}));

/**
 * 菜单树由 generateMenus 依据 router.getRoutes() 的真实路径生成：
 * 一级菜单不带 parents，只有子菜单才会被写入 parent/parents。
 * 这里复现「默认子路由 path 为空」的形态——父子菜单路径同为 /cards。
 */
function createMenus(): MenuRecordRaw[] {
  return [
    {
      name: '卡管理',
      path: '/cards',
      children: [
        {
          name: '卡片列表',
          path: '/cards',
          parent: '/cards',
          parents: ['/cards'],
          children: [],
        },
      ],
    },
    {
      name: '交易管理',
      path: '/transactions',
      children: [
        {
          name: '标准化交易',
          path: '/transactions/normalized',
          parent: '/transactions',
          parents: ['/transactions'],
          children: [],
        },
      ],
    },
  ];
}

let activeApp: App | undefined;

function mountExtraMenu(menus: MenuRecordRaw[]) {
  const holder: { api?: ReturnType<typeof useExtraMenu> } = {};
  const host = document.createElement('div');
  document.body.append(host);
  activeApp = createApp({
    setup() {
      holder.api = useExtraMenu(computed(() => menus));
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
  mockPreferences.sidebar.expandOnHover = true;
}

function setPath(path: string) {
  routeHolder.current = { meta: {}, path };
}

describe('useExtraMenu', () => {
  it('解析出二级菜单：默认子路由 path 为空导致父子菜单路径相同', async () => {
    try {
      setPath('/cards');
      const { extraActiveMenu, extraMenus, sidebarExtraVisible } =
        mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(1);
      });
      expect(extraMenus.value[0]?.name).toBe('卡片列表');
      expect(extraActiveMenu.value).toBe('/cards');
      expect(sidebarExtraVisible.value).toBe(true);
    } finally {
      cleanup();
    }
  });

  it('常规嵌套路径仍能解析出同级二级菜单', async () => {
    try {
      setPath('/transactions/normalized');
      const { extraActiveMenu, extraMenus } = mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(1);
      });
      expect(extraMenus.value[0]?.name).toBe('标准化交易');
      expect(extraActiveMenu.value).toBe('/transactions');
    } finally {
      cleanup();
    }
  });

  it('路径不在菜单树中时二级菜单为空且不报错', async () => {
    try {
      setPath('/non-existent');
      const { extraActiveMenu, extraMenus, sidebarExtraVisible } =
        mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(0);
      });
      expect(extraActiveMenu.value).toBe('');
      // 没有二级菜单就不能展开面板，否则空面板会遮住正文
      expect(sidebarExtraVisible.value).toBe(false);
    } finally {
      cleanup();
    }
  });

  it('取消固定时，路径不在菜单树中同样不展开二级面板', async () => {
    try {
      mockPreferences.sidebar.expandOnHover = false;
      setPath('/non-existent');
      const { extraMenus, sidebarExtraVisible } = mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(0);
      });
      expect(sidebarExtraVisible.value).toBe(false);
    } finally {
      cleanup();
    }
  });

  it('鼠标移出侧边栏时按当前路径还原二级菜单', async () => {
    try {
      mockPreferences.sidebar.expandOnHover = false;
      setPath('/cards');
      const { extraMenus, handleMenuMouseEnter, handleSideMouseLeave } =
        mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(1);
      });

      // 悬停到另一个一级菜单会替换二级菜单，移出后应还原为当前路由所属的
      handleMenuMouseEnter(createMenus()[1] as MenuRecordRaw);
      expect(extraMenus.value[0]?.name).toBe('标准化交易');

      handleSideMouseLeave();
      expect(extraMenus.value).toHaveLength(1);
      expect(extraMenus.value[0]?.name).toBe('卡片列表');
    } finally {
      cleanup();
    }
  });

  it('鼠标移出时按 activePath 还原二级菜单（隐藏详情页）', async () => {
    try {
      mockPreferences.sidebar.expandOnHover = false;
      // 隐藏详情页的字面路径不在菜单树中，靠 activePath 挂靠到其列表页
      routeHolder.current = {
        meta: { activePath: '/cards' },
        path: '/cards/17',
      };
      const { extraMenus, handleMenuMouseEnter, handleSideMouseLeave } =
        mountExtraMenu(createMenus());

      await vi.waitFor(() => {
        expect(extraMenus.value).toHaveLength(1);
      });
      expect(extraMenus.value[0]?.name).toBe('卡片列表');

      handleMenuMouseEnter(createMenus()[1] as MenuRecordRaw);
      expect(extraMenus.value[0]?.name).toBe('标准化交易');

      // 移出后应还原为 activePath 对应的二级菜单，而不是被字面路径清空
      handleSideMouseLeave();
      expect(extraMenus.value).toHaveLength(1);
      expect(extraMenus.value[0]?.name).toBe('卡片列表');
    } finally {
      cleanup();
    }
  });
});
