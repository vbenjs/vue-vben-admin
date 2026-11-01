import { createApp } from 'vue';

import { initStores, useTabbarStore } from '@vben/stores';

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTabs } from '../use-tabs';

const { currentRoute } = vi.hoisted(() => {
  return {
    currentRoute: {
      fullPath: '/detail?id=7',
      meta: {},
      name: 'Detail',
      path: '/detail',
      query: { id: '7' },
    },
  };
});

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return {
    ...actual,
    useRoute: () => currentRoute,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  };
});

function createTab(id: string) {
  const fullPath = `/detail?id=${id}`;
  return {
    fullPath,
    key: fullPath,
    meta: { title: 'Detail' },
    name: 'Detail',
    path: '/detail',
    query: { id },
  } as any;
}

describe('useTabs', () => {
  beforeEach(async () => {
    await initStores(createApp({}), { namespace: 'use-tabs-test' });
  });

  function seedTabs() {
    const store = useTabbarStore();
    store.addTab({
      fullPath: '/home',
      key: '/home',
      meta: { affixTab: true, title: 'Home' },
      name: 'Home',
      path: '/home',
      query: {},
    } as any);
    for (const id of ['1', '2', '7']) {
      store.addTab(createTab(id));
    }
    return store;
  }

  it('locates the tab by its key instead of its path', () => {
    const store = seedTabs();
    const { getTabDisableState } = useTabs();

    const state = getTabDisableState(store.getTabByKey('/detail?id=7') as any);

    // /detail?id=7 是最后一个标签页：左侧有可关闭的标签页，右侧没有
    expect(state.disabledCloseLeft).toBe(false);
    expect(state.disabledCloseRight).toBe(true);
  });

  it('treats a background tab with the same path as not being the current tab', () => {
    const store = seedTabs();
    const { getTabDisableState } = useTabs();

    const state = getTabDisableState(store.getTabByKey('/detail?id=1') as any);

    expect(state.disabledRefresh).toBe(true);
    expect(state.disabledCloseOther).toBe(true);
  });
});
