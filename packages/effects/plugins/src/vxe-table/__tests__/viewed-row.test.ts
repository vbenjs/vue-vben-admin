import type { ViewedRowStorageAdapter } from '../viewed-row/types';

import { describe, expect, it, vi } from 'vitest';

import { useViewedRow } from '../viewed-row';

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function createAdapter(
  overrides: Partial<ViewedRowStorageAdapter> = {},
): ViewedRowStorageAdapter {
  return {
    getKeys: vi.fn(async () => []),
    removeKeys: vi.fn(async () => {}),
    setKeys: vi.fn(async () => {}),
    ...overrides,
  };
}

describe('useViewedRow storage restore', () => {
  it('restores the stored keys once the adapter resolves', async () => {
    const adapter = createAdapter({
      getKeys: vi.fn(async () => [1, 2]),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
    });
    await flush();

    expect(helper.isViewed({ id: 1 })).toBe(true);
    expect(helper.isViewed({ id: 2 })).toBe(true);
  });

  it('keeps the set empty when it is cleared while the restore is loading', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
    });

    helper.clearViewed();
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.viewedSet.value.size).toBe(0);
    expect(helper.isViewed({ id: 1 })).toBe(false);
  });

  it('does not resurrect a key that was removed while the restore is loading', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
    });

    helper.markAsViewed({ id: 1 });
    helper.removeKeys([1]);
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.isViewed({ id: 1 })).toBe(false);
    expect(helper.isViewed({ id: 2 })).toBe(true);
  });

  it('still merges the stored keys with keys marked while the restore is loading', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
    });

    helper.markAsViewed({ id: 3 });
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.viewedSet.value.size).toBe(3);
    expect(helper.isViewed({ id: 1 })).toBe(true);
    expect(helper.isViewed({ id: 3 })).toBe(true);
  });

  it('drops the initial viewedKeys merge when the set is cleared during the restore', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
      viewedKeys: [1],
    });

    helper.clearViewed();
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.viewedSet.value.size).toBe(0);
    expect(helper.isViewed({ id: 1 })).toBe(false);
  });

  it('skips removed keys in the initial viewedKeys merge', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
      viewedKeys: [1, 2],
    });

    helper.removeKeys([1]);
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.isViewed({ id: 1 })).toBe(false);
    expect(helper.isViewed({ id: 2 })).toBe(true);
  });

  it('persists the removal of a key that only exists in the pending snapshot', async () => {
    const deferred = createDeferred<Array<number | string>>();
    const stored: Array<number | string> = [1];
    const setKeys = vi.fn(async (keys: Array<number | string>) => {
      stored.splice(0, stored.length, ...keys);
    });
    const adapter = createAdapter({
      getKeys: vi.fn(() => deferred.promise),
      setKeys,
    });

    const helper = useViewedRow({
      keyField: 'id',
      persist: { storage: adapter, type: 'custom' },
    });

    helper.removeKeys([1]);
    deferred.resolve([1, 2]);
    await flush();

    expect(helper.isViewed({ id: 1 })).toBe(false);
    expect(helper.isViewed({ id: 2 })).toBe(true);
    expect(setKeys).toHaveBeenCalled();
    expect(stored).not.toContain(1);
  });
});
