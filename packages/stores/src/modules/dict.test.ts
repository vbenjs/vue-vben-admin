import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { setDictHandler, useDictStore } from './dict';

describe('useDictStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    setDictHandler({});
  });

  afterEach(() => {
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
});
