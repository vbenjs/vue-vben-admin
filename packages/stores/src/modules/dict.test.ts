import type { DictItem } from './dict';

import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setDictHandler, useDictStore } from './dict';

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe('useDictStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setDictHandler({});
  });

  afterEach(() => {
    // pendingRequests 是模块级的，不随 Pinia 实例重建而清空
    useDictStore().$reset();
    setDictHandler({});
  });

  it('returns empty array when no handler is injected', async () => {
    const store = useDictStore();
    await expect(store.getDict('user_gender')).resolves.toEqual([]);
    expect(store.getDictSync('user_gender')).toEqual([]);
  });

  it('dedupes concurrent getDict calls for the same code', async () => {
    const getDict = vi.fn(async () => [
      { label: 'Male', value: 1 },
      { label: 'Female', value: 0 },
    ]);
    setDictHandler({ getDict });

    const store = useDictStore();
    const [a, b] = await Promise.all([
      store.getDict('user_gender'),
      store.getDict('user_gender'),
    ]);

    expect(getDict).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
    expect(store.getDictSync('user_gender')).toHaveLength(2);
  });

  it('compares dict values as strings and falls back to original value', async () => {
    setDictHandler({
      getDict: async () => [{ label: 'Enabled', value: 1 }],
    });
    const store = useDictStore();
    await store.getDict('common_status');

    expect(store.getDictItem('common_status', '1')?.label).toBe('Enabled');
    expect(store.getDictLabel('common_status', 1)).toBe('Enabled');
    expect(store.getDictLabel('common_status', 9)).toBe(9);
  });

  it('skips loadAllDicts when version matches and cache is warm', async () => {
    const getAllDicts = vi.fn(async () => ({
      user_gender: [{ label: 'Male', value: 1 }],
    }));
    const getVersion = vi.fn(async () => 3);
    setDictHandler({ getAllDicts, getVersion });

    const store = useDictStore();
    await store.loadAllDicts();
    expect(getAllDicts).toHaveBeenCalledTimes(1);
    expect(store.version).toBe(3);

    await store.loadAllDicts();
    expect(getAllDicts).toHaveBeenCalledTimes(1);

    getVersion.mockResolvedValueOnce(4);
    await store.loadAllDicts();
    expect(getAllDicts).toHaveBeenCalledTimes(2);
    expect(store.version).toBe(4);
  });

  it('discards late getDict results after $reset', async () => {
    let resolveRequest!: (items: { label: string; value: number }[]) => void;
    setDictHandler({
      getDict: () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    });

    const store = useDictStore();
    const pending = store.getDict('user_gender');
    store.$reset();
    resolveRequest([{ label: 'Male', value: 1 }]);
    await pending;

    expect(store.getDictSync('user_gender')).toEqual([]);
  });

  it('ignores a stale getDict result and keeps dedupe after refreshDict(code)', async () => {
    const stale = deferred<DictItem[]>();
    const fresh = deferred<DictItem[]>();
    const getDict = vi
      .fn<(code: string) => Promise<DictItem[]>>()
      .mockReturnValueOnce(stale.promise)
      .mockReturnValueOnce(fresh.promise);
    setDictHandler({ getDict });

    const store = useDictStore();
    const first = store.getDict('user_gender');
    store.refreshDict('user_gender');
    void store.getDict('user_gender');

    stale.resolve([{ label: 'Old', value: 1 }]);
    await first;
    expect(store.dictMap.user_gender).toBeUndefined();

    const third = store.getDict('user_gender');
    expect(getDict).toHaveBeenCalledTimes(2);

    fresh.resolve([{ label: 'New', value: 1 }]);
    await expect(third).resolves.toEqual([{ label: 'New', value: 1 }]);
    expect(store.getDictLabel('user_gender', 1)).toBe('New');
  });

  it('discards in-flight results after refreshDict()', async () => {
    const single = deferred<DictItem[]>();
    const all = deferred<Record<string, DictItem[]>>();
    setDictHandler({
      getAllDicts: () => all.promise,
      getDict: () => single.promise,
    });

    const store = useDictStore();
    const pendingSingle = store.getDict('user_gender');
    const pendingAll = store.loadAllDicts();
    store.refreshDict();

    single.resolve([{ label: 'Male', value: 1 }]);
    all.resolve({ common_status: [{ label: 'Enabled', value: 1 }] });
    await Promise.all([pendingSingle, pendingAll]);

    expect(store.dictMap).toEqual({});
  });
});
