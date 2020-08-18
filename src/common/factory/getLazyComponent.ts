/**
 * 获取动态组件
 */

export function getLazyComponent(path: string) {
  // !开发环境会有警告，如果不想显示警告，可以注释掉，用下面的方式，但是打包的时候这里需要还原
  return () => import(`@/views/${path}.vue`);

  // return () => Promise.resolve(require(`@/views/${path}.vue`).default);
}
