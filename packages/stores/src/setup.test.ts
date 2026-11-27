import { createApp, ref } from 'vue';

import { defineStore } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { initStores, resetAllStores } from './setup';

describe('resetAllStores', () => {
  beforeEach(async () => {
    localStorage.clear();
    const app = createApp({});
    await initStores(app, { namespace: 'test' });
  });

  it('resets options stores and setup stores with custom $reset while skipping setup stores without $reset', () => {
    const useSetupWithoutResetStore = defineStore(
      'test-setup-without-reset',
      () => {
        const value = ref('initial');
        return { value };
      },
    );

    const useOptionsStore = defineStore('test-options', {
      state: () => ({
        count: 0,
      }),
    });

    const customResetSpy = vi.fn();
    const useSetupWithResetStore = defineStore('test-setup-with-reset', () => {
      const label = ref('initial');
      function $reset() {
        customResetSpy();
        label.value = 'initial';
      }
      return { $reset, label };
    });

    // Register the setup store without $reset first so iteration hits it before the others.
    const setupWithoutResetStore = useSetupWithoutResetStore();
    const optionsStore = useOptionsStore();
    const setupWithResetStore = useSetupWithResetStore();

    setupWithoutResetStore.value = 'changed';
    optionsStore.count = 42;
    setupWithResetStore.label = 'changed';

    expect(() => resetAllStores()).not.toThrow();

    expect(setupWithoutResetStore.value).toBe('changed');
    expect(optionsStore.count).toBe(0);
    expect(setupWithResetStore.label).toBe('initial');
    expect(customResetSpy).toHaveBeenCalledTimes(1);
  });

  it('rethrows real errors thrown by custom $reset implementations', () => {
    const useFailingResetStore = defineStore('test-failing-reset', () => {
      function $reset() {
        throw new Error('custom reset failed');
      }
      return { $reset };
    });

    useFailingResetStore();

    expect(() => resetAllStores()).toThrow('custom reset failed');
  });
});
