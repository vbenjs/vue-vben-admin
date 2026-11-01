import { describe, expect, it } from 'vitest';

import { getCachedTabKeys } from '../cached-tab-keys';

describe('getCachedTabKeys', () => {
  it('uses the stored tab key so cleanup keeps the registered cached route', () => {
    // addCachedRoute 用合并后的 route.meta 算出 "/detail"，
    // 而标签页自身的 meta 只有叶子记录，重新推导会得到 "/detail?id=7"
    const tabs = [
      {
        fullPath: '/detail?id=7',
        key: '/detail',
        meta: { domCached: true },
        name: 'Detail',
        path: '/detail',
        query: { id: '7' },
      },
    ] as any;

    expect(getCachedTabKeys(tabs)).toEqual(['/detail']);
  });

  it('skips tabs that are not dom cached', () => {
    const tabs = [
      {
        fullPath: '/home',
        key: '/home',
        meta: {},
        name: 'Home',
        path: '/home',
      },
      {
        fullPath: '/detail',
        key: '/detail',
        meta: { domCached: true },
        name: 'Detail',
        path: '/detail',
      },
    ] as any;

    expect(getCachedTabKeys(tabs)).toEqual(['/detail']);
  });
});
