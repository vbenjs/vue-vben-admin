import { createApp, effectScope, ref } from 'vue';

import { useContentMaximize } from '@vben/hooks';
import { initStores, useTabbarStore } from '@vben/stores';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTabbar } from '../use-tabbar';

const { currentRoute } = vi.hoisted(() => {
  return {
    currentRoute: {
      fullPath: '/home',
      matched: [],
      meta: { affixTab: true, title: 'Home' },
      name: 'Home',
      path: '/home',
      query: {},
    },
  };
});

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return {
    ...actual,
    useRoute: () => currentRoute,
    useRouter: () => ({
      getRoutes: () => [],
      push: vi.fn(),
      replace: vi.fn(),
    }),
  };
});

// useI18n 要求组件实例，这里只关心菜单项过滤，换成固定的 locale
vi.mock('@vben/locales', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@vben/locales')>();
  return {
    ...actual,
    $t: (key: string) => key,
    useI18n: () => ({ locale: ref('zh-CN') }),
  };
});

/** useTabbar 内部有 watch，放在独立 scope 里执行 */
function withTabbar() {
  const scope = effectScope();
  const result = scope.run(() => useTabbar()) as ReturnType<typeof useTabbar>;
  return { ...result, scope };
}

describe('useTabbar context menus', () => {
  beforeEach(async () => {
    await initStores(createApp({}), { namespace: 'use-tabbar-test' });
  });

  function seedTab() {
    const store = useTabbarStore();
    store.addTab({
      fullPath: '/detail',
      key: '/detail',
      meta: { title: 'Detail' },
      name: 'Detail',
      path: '/detail',
      query: {},
    } as any);
    const tab = store.getTabs.find((item) => item.key === '/detail');
    expect(tab).toBeDefined();
    return tab as NonNullable<typeof tab>;
  }

  it('keeps the maximize entry while the content is not maximized', () => {
    const tab = seedTab();
    const { createContextMenus, scope } = withTabbar();

    const entries = createContextMenus(tab);

    expect(entries.find((entry) => entry.key === 'maximize')).toBeDefined();
    scope.stop();
  });

  it('keeps the maximize entry after the content is maximized', () => {
    const tab = seedTab();
    const { createContextMenus, scope } = withTabbar();
    const { contentIsMaximize, toggleMaximize } = useContentMaximize();

    // 白名单默认只含 'maximize'。最大化后菜单项的 key 若随之变化就会被过滤掉，
    // 而 tabbar.showMaximize 关闭时右侧没有其它还原入口，用户会被卡住。
    expect(useTabbarStore().getMenuList).toContain('maximize');
    expect(useTabbarStore().getMenuList).not.toContain('restore-maximize');

    toggleMaximize();

    expect(contentIsMaximize.value).toBe(true);
    expect(
      createContextMenus(tab).find((entry) => entry.key === 'maximize'),
    ).toBeDefined();
    scope.stop();
  });

  it('still drops entries that the menu list does not allow', () => {
    const tab = seedTab();
    useTabbarStore().setMenuList(['close']);

    const { createContextMenus, scope } = withTabbar();

    expect(createContextMenus(tab).map((entry) => entry.key)).toEqual([
      'close',
    ]);
    scope.stop();
  });
});
