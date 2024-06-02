import { toLowerCaseFirstLetter } from '@vben-core/toolkit';

/**
 * 将扁平对象转换为嵌套对象。
 *
 * @template T - 输入对象值的类型
 * @param {Record<string, T>} obj - 要转换的扁平对象
 * @param {number} level - 嵌套的层级
 * @returns {T} 嵌套对象
 *
 * @example
 * 将扁平对象转换为嵌套对象，嵌套层级为 1
 * const flatObject = {
 *   'commonAppName': 1,
 *   'anotherKeyExample': 2,
 *   'someOtherKey': 3
 * };
 * const nestedObject = nestedObject(flatObject, 1);
 * console.log(nestedObject);
 * 输出:
 * {
 *   commonAppName: 1,
 *   anotherKeyExample: 2,
 *   someOtherKey: 3
 * }
 *
 * @example
 * 将扁平对象转换为嵌套对象，嵌套层级为 2
 * const flatObject = {
 *   'appCommonName': 1,
 *   'appAnotherKeyExample': 2,
 *   'appSomeOtherKey': 3
 * };
 * const nestedObject = nestedObject(flatObject, 2);
 * console.log(nestedObject);
 * 输出:
 * {
 *   app: {
 *     commonName: 1,
 *     anotherKeyExample: 2,
 *     someOtherKey: 3
 *   }
 * }
 */

function nestedObject<T>(obj: Record<string, T>, level: number): T {
  const result: any = {};

  for (const key in obj) {
    const keys = key.split(/(?=[A-Z])/);
    // 将驼峰式分割为数组;
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const lowerKey = keys[i].toLowerCase();
      if (i === level - 1) {
        const remainingKeys = keys.slice(i).join(''); // 保留后续部分作为键的一部分
        current[toLowerCaseFirstLetter(remainingKeys)] = obj[key];
        break;
      } else {
        current[lowerKey] = current[lowerKey] || {};
        current = current[lowerKey];
      }
    }
  }

  return result as T;
}

export { nestedObject };
