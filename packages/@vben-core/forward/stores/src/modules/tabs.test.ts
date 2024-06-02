import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

import { useTabsStore } from './tabs';

describe('useAccessStore', () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [],
  });
  router.push = vi.fn();
  router.replace = vi.fn();
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('adds a new tab', () => {
    const store = useTabsStore();
    const tab: any = {
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    };
    store.addTab(tab);
    expect(store.tabs.length).toBe(1);
    expect(store.tabs[0]).toEqual(tab);
  });

  it('adds a new tab if it does not exist', () => {
    const store = useTabsStore();
    const newTab: any = {
      fullPath: '/new',
      meta: {},
      name: 'New',
      path: '/new',
    };
    store.addTab(newTab);
    expect(store.tabs).toContainEqual(newTab);
  });

  it('updates an existing tab instead of adding a new one', () => {
    const store = useTabsStore();
    const initialTab: any = {
      fullPath: '/existing',
      meta: {},
      name: 'Existing',
      path: '/existing',
      query: {},
    };
    store.tabs.push(initialTab);
    const updatedTab = { ...initialTab, query: { id: '1' } };
    store.addTab(updatedTab);
    expect(store.tabs.length).toBe(1);
    expect(store.tabs[0].query).toEqual({ id: '1' });
  });

  it('closes all tabs', async () => {
    const store = useTabsStore();
    store.tabs = [
      { fullPath: '/home', meta: {}, name: 'Home', path: '/home' },
    ] as any;
    router.replace = vi.fn(); // 使用 vitest 的 mock 函数

    await store.closeAllTabs(router);

    expect(store.tabs.length).toBe(0); // 假设没有固定的标签页
    // expect(router.replace).toHaveBeenCalled();
  });

  it('returns all tabs including affix tabs', () => {
    const store = useTabsStore();
    store.tabs = [
      { fullPath: '/home', meta: {}, name: 'Home', path: '/home' },
    ] as any;
    store.affixTabs = [
      { meta: { hideInTab: false }, path: '/dashboard' },
    ] as any;

    const result = store.getTabs;
    expect(result.length).toBe(2);
    expect(result.find((tab) => tab.path === '/dashboard')).toBeDefined();
  });

  it('closes a non-affix tab', () => {
    const store = useTabsStore();
    const tab: any = {
      fullPath: '/closable',
      meta: {},
      name: 'Closable',
      path: '/closable',
    };
    store.tabs.push(tab);
    store._close(tab);
    expect(store.tabs.length).toBe(0);
  });

  it('does not close an affix tab', () => {
    const store = useTabsStore();
    const affixTab: any = {
      fullPath: '/affix',
      meta: { affixTab: true },
      name: 'Affix',
      path: '/affix',
    };
    store.tabs.push(affixTab);
    store._close(affixTab);
    expect(store.tabs.length).toBe(1); // Affix tab should not be closed
  });

  it('returns all cache tabs', () => {
    const store = useTabsStore();
    store.cacheTabs.add('Home');
    store.cacheTabs.add('About');
    expect(store.getCacheTabs).toEqual(['Home', 'About']);
  });

  it('returns all tabs, including affix tabs', () => {
    const store = useTabsStore();
    const normalTab: any = {
      fullPath: '/normal',
      meta: {},
      name: 'Normal',
      path: '/normal',
    };
    const affixTab: any = {
      fullPath: '/affix',
      meta: { affixTab: true },
      name: 'Affix',
      path: '/affix',
    };
    store.tabs.push(normalTab);
    store.affixTabs.push(affixTab);
    expect(store.getTabs).toContainEqual(normalTab);
    // expect(store.getTabs).toContainEqual(affixTab);
  });

  it('navigates to a specific tab', async () => {
    const store = useTabsStore();
    const tab: any = { meta: {}, name: 'Dashboard', path: '/dashboard' };

    await store._goToTab(tab, router);

    expect(router.replace).toHaveBeenCalledWith({
      params: {},
      path: '/dashboard',
      query: {},
    });
  });

  it('closes multiple tabs by paths', async () => {
    const store = useTabsStore();
    store.addTab({
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    } as any);
    store.addTab({
      fullPath: '/about',
      meta: {},
      name: 'About',
      path: '/about',
    } as any);
    store.addTab({
      fullPath: '/contact',
      meta: {},
      name: 'Contact',
      path: '/contact',
    } as any);

    await store._bulkCloseByPaths(['/home', '/contact']);

    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].name).toBe('About');
  });

  it('closes all tabs to the left of the specified tab', async () => {
    const store = useTabsStore();
    store.addTab({
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    } as any);
    store.addTab({
      fullPath: '/about',
      meta: {},
      name: 'About',
      path: '/about',
    } as any);
    const targetTab: any = {
      fullPath: '/contact',
      meta: {},
      name: 'Contact',
      path: '/contact',
    };
    store.addTab(targetTab);

    await store.closeLeftTabs(targetTab);

    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].name).toBe('Contact');
  });

  it('closes all tabs except the specified tab', async () => {
    const store = useTabsStore();
    store.addTab({
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    } as any);
    const targetTab: any = {
      fullPath: '/about',
      meta: {},
      name: 'About',
      path: '/about',
    };
    store.addTab(targetTab);
    store.addTab({
      fullPath: '/contact',
      meta: {},
      name: 'Contact',
      path: '/contact',
    } as any);

    await store.closeOtherTabs(targetTab);

    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].name).toBe('About');
  });

  it('closes all tabs to the right of the specified tab', async () => {
    const store = useTabsStore();
    const targetTab: any = {
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    };
    store.addTab(targetTab);
    store.addTab({
      fullPath: '/about',
      meta: {},
      name: 'About',
      path: '/about',
    } as any);
    store.addTab({
      fullPath: '/contact',
      meta: {},
      name: 'Contact',
      path: '/contact',
    } as any);

    await store.closeRightTabs(targetTab);

    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].name).toBe('Home');
  });

  it('closes the tab with the specified key', async () => {
    const store = useTabsStore();
    const keyToClose = '/about';
    store.addTab({
      fullPath: '/home',
      meta: {},
      name: 'Home',
      path: '/home',
    } as any);
    store.addTab({
      fullPath: keyToClose,
      meta: {},
      name: 'About',
      path: '/about',
    } as any);
    store.addTab({
      fullPath: '/contact',
      meta: {},
      name: 'Contact',
      path: '/contact',
    } as any);

    await store.closeTabByKey(keyToClose, router);

    expect(store.tabs).toHaveLength(2);
    expect(
      store.tabs.find((tab) => tab.fullPath === keyToClose),
    ).toBeUndefined();
  });

  it('refreshes the current tab', async () => {
    const store = useTabsStore();
    const currentTab: any = {
      fullPath: '/dashboard',
      meta: { name: 'Dashboard' },
      name: 'Dashboard',
      path: '/dashboard',
    };
    router.currentRoute.value = currentTab;

    await store.refreshTab(router);

    expect(store.excludeCacheTabs.has('Dashboard')).toBe(false);
    expect(store.renderRouteView).toBe(true);
  });
});
