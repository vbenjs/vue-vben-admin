import type { Flatten } from '@vben-core/typings';

import {
  capitalizeFirstLetter,
  toLowerCaseFirstLetter,
} from '@vben-core/toolkit';

/**
 *  生成驼峰命名法的键名
 * @param key
 * @param parentKey
 */
function toCamelCase(key: string, parentKey: string): string {
  if (!parentKey) {
    return key;
  }
  return parentKey + key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * 将嵌套对象扁平化
 * @param obj - 需要扁平化的对象
 * @param parentKey - 父键名，用于递归时拼接键名
 * @param result - 存储结果的对象
 * @returns 扁平化后的对象
 *
 * 示例：
 * const nestedObj = {
 *   user: {
 *     name: 'Alice',
 *     address: {
 *       city: 'Wonderland',
 *       zip: '12345'
 *     }
 *   },
 *   items: [
 *     { id: 1, name: 'Item 1' },
 *     { id: 2, name: 'Item 2' }
 *   ],
 *   active: true
 * };
 * const flatObj = flattenObject(nestedObj);
 * console.log(flatObj);
 * 输出:
 * {
 *   userName: 'Alice',
 *   userAddressCity: 'Wonderland',
 *   userAddressZip: '12345',
 *   items: [ { id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' } ],
 *   active: true
 * }
 */
function flattenObject<T extends Record<string, any>>(
  obj: T,
  parentKey: string = '',
  result: Record<string, any> = {},
): Flatten<T> {
  Object.keys(obj).forEach((key) => {
    const newKey = parentKey
      ? `${parentKey}${capitalizeFirstLetter(key)}`
      : key;
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  });
  return result as Flatten<T>;
}

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
 * const nestedObject = toNestedObject(flatObject, 1);
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
 * const nestedObject = toNestedObject(flatObject, 2);
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

function toNestedObject<T>(obj: Record<string, T>, level: number): T {
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

export { flattenObject, toCamelCase, toNestedObject };

// 定义递归类型，用于推断扁平化后的对象类型
// 限制递归深度的辅助类型
// type FlattenDepth<
//   T,
//   Depth extends number,
//   CurrentDepth extends number[] = [],
// > = {
//   [K in keyof T as CurrentDepth['length'] extends Depth
//     ? K
//     : T[K] extends object
//       ? `${CurrentDepth['length'] extends 0 ? Uncapitalize<K & string> : Capitalize<K & string>}${keyof FlattenDepth<T[K], Depth, [...CurrentDepth, 1]> extends string ? Capitalize<keyof FlattenDepth<T[K], Depth, [...CurrentDepth, 1]>> : ''}`
//       : `${CurrentDepth['length'] extends 0 ? Uncapitalize<K & string> : Capitalize<K & string>}`]: CurrentDepth['length'] extends Depth
//     ? T[K]
//     : T[K] extends object
//       ? FlattenDepth<T[K], Depth, [...CurrentDepth, 1]>[keyof FlattenDepth<
//           T[K],
//           Depth,
//           [...CurrentDepth, 1]
//         >]
//       : T[K];
// };

// type Flatten<T, Depth extends number = 4> = FlattenDepth<T, Depth>;
