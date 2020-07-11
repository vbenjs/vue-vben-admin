/**
 * @description: 根据数组中某个对象值去重
 */
export function unique<T>(arr: T[], key: string): T[] {
  const map = new Map();
  return arr.filter((item) => !map.has(item[key]) && map.set(item[key], 1));
}

/**
 * @description: es6数组去重复
 */
export function es6Unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
