import type { Recordable } from '@vben/types';

/**
 * 一个缓存对象，在不刷新页面时，无需重复请求远程接口
 */
export const ICONS_MAP: Recordable<string[]> = {};

export async function fetchIconsData(prefix: string) {
  if (!Reflect.has(ICONS_MAP, prefix) || !ICONS_MAP[prefix]) {
    const data: string[] = await fetch(
      `https://api.iconify.design/collection?prefix=${prefix}`,
    )
      .then((res) => res.json())
      .then((res) => {
        const list = res.uncategorized;
        if (res.categories) {
          for (const category in res.categories) {
            list.push(...res.categories[category]);
          }
        }
        return list;
      });
    ICONS_MAP[prefix] = data.map((v) => `${prefix}:${v}`);
  }
  return ICONS_MAP[prefix];
}
