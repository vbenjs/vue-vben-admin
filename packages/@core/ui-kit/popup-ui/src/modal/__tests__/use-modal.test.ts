import type { App, Ref } from 'vue';

import type { ExtendedModalApi } from '../modal';

import { createApp, defineComponent, h, nextTick, ref, toRaw } from 'vue';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVbenModal } from '../use-modal';

vi.mock('@vben-core/preferences', () => ({
  usePreferences: () => ({
    globalEscapeShortcutKey: { value: true },
  }),
}));

vi.mock('../modal.vue', () => ({
  default: {
    name: 'VbenModalStub',
    render: () => null,
  },
}));

let activeApp: App | undefined;

async function mountRebindingHarness() {
  const consumerKey = ref(0);
  let currentApi: ExtendedModalApi | undefined;

  const Consumer = defineComponent(() => {
    const [Modal, modalApi] = useVbenModal();
    currentApi = modalApi;
    return () => h(Modal);
  });

  const ConnectedModal = defineComponent(() => {
    return () => h(Consumer, { key: consumerKey.value });
  });

  const [ParentModal, parentApi] = useVbenModal({
    connectedComponent: ConnectedModal,
  });
  const host = document.createElement('div');
  document.body.append(host);

  activeApp = createApp(() => h(ParentModal));
  activeApp.mount(host);
  await nextTick();

  return {
    consumerKey,
    getCurrentApi: () => currentApi,
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

describe('useVbenModal', () => {
  it('rebinds the parent api when the consumer is recreated', async () => {
    const { consumerKey, getCurrentApi, parentApi } =
      await mountRebindingHarness();
    const initialApi = getCurrentApi();

    expect(initialApi).toBeDefined();
    if (!initialApi) return;
    expect(toRaw(parentApi.store)).toBe(initialApi.store);

    await remountConsumer(consumerKey);
    const recreatedApi = getCurrentApi();

    expect(recreatedApi).toBeDefined();
    if (!recreatedApi) return;
    expect(recreatedApi).not.toBe(initialApi);
    expect(toRaw(parentApi.store)).toBe(recreatedApi.store);

    parentApi.open();
    expect(recreatedApi.store.state.isOpen).toBe(true);
    expect(initialApi.store.state.isOpen).toBe(false);

    await parentApi.close();
    expect(recreatedApi.store.state.isOpen).toBe(false);
  });
});
