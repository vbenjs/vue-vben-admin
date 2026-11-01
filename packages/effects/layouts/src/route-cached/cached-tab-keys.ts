import type { TabDefinition } from '@vben-core/typings';

import { getTabKey } from '@vben/stores';

/**
 * 需要保留缓存的路由 key。已存标签页以自身 key 为准，
 * 避免从 meta 重新推导时与 addCachedRoute 用的 key 不一致而误删缓存。
 */
export function getCachedTabKeys(tabs: TabDefinition[]): string[] {
  return tabs
    .filter((item) => item.meta.domCached)
    .map((item) => item.key ?? getTabKey(item));
}
