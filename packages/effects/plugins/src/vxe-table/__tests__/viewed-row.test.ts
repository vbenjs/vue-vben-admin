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
});
