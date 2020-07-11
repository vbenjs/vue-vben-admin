/**
 * 合并两个对象
 * @param {*} obj1
 * @param {*} obj2
 */
export function deepMerge<T, R = T>(obj1: T, obj2: R): T {
  let key;
  for (key in obj2) {
    obj1[key] =
      obj1[key] && obj1[key].toString() === '[object Object]'
        ? deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key]);
  }
  return obj1;
}
