import type { App, Ref } from 'vue';

import type { ExtendedDrawerApi } from '../drawer';

import { createApp, defineComponent, h, nextTick, ref } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVbenDrawer } from '../use-drawer';

vi.mock('@vben-core/preferences', () => ({
  usePreferences: () => ({
    globalEscapeShortcutKey: { value: true },
  }),
}));

vi.mock('../drawer.vue', () => ({
  default: {
    name: 'VbenDrawerStub',
    render: () => null,
  },
}));

let activeApp: App | undefined;

async function mountRebindingHarness() {
  const consumerKey = ref(0);
  let currentApi: ExtendedDrawerApi | undefined;
  const onOpenChange = vi.fn();

  const Consumer = defineComponent(() => {
    const [Drawer, drawerApi] = useVbenDrawer();
    currentApi = drawerApi;
    return () => h(Drawer);
  });

  const ConnectedDrawer = defineComponent(() => {
    return () => h(Consumer, { key: consumerKey.value });
  });

  const [ParentDrawer, parentApi] = useVbenDrawer({
    connectedComponent: ConnectedDrawer,
    onOpenChange,
    title: 'Parent drawer title',
  });
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp(() => h(ParentDrawer));
  activeApp.mount(host);
  await nextTick();

  return {
    consumerKey,
    getCurrentApi: () => currentApi,
    onOpenChange,
    parentApi,
  };
}

async function remountConsumer(consumerKey: Ref<number>) {
  consumerKey.value += 1;
  await nextTick();
}

afterEach(() => {
  activeApp?.unmount();
  activeApp = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('useVbenDrawer', () => {
  it('rebinds the parent api when the consumer is recreated', async () => {
    const { consumerKey, getCurrentApi, onOpenChange, parentApi } =
      await mountRebindingHarness();
    const initialApi = getCurrentApi();

    expect(initialApi).toBeDefined();
    if (!initialApi) return;
    expect(parentApi.store).toBe(initialApi.store);
    const initialData = { id: 1 };
    parentApi.setData(initialData);
    expect(initialApi.getData()).toBe(initialData);

    await remountConsumer(consumerKey);
    const recreatedApi = getCurrentApi();

    expect(recreatedApi).toBeDefined();
    if (!recreatedApi) return;
    expect(recreatedApi).not.toBe(initialApi);
    expect(recreatedApi.store.state.title).toBe('Parent drawer title');
    expect(parentApi.store).toBe(recreatedApi.store);
    const recreatedData = { id: 2 };
    parentApi.setData(recreatedData);
    expect(recreatedApi.getData()).toBe(recreatedData);

    parentApi.open();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(recreatedApi.store.state.isOpen).toBe(true);
    expect(initialApi.store.state.isOpen).toBe(false);

    await parentApi.close();
    expect(recreatedApi.store.state.isOpen).toBe(false);
  });
});
