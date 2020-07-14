/**
 * 获取动态组件
 */

export function getLazyComponent(path: string) {
  return () => Promise.resolve(require(`@/views/${path}.vue`).default);
}
