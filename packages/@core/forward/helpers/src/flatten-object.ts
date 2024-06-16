import type { Flatten } from '@vben-core/typings';

import { capitalizeFirstLetter } from '@vben-core/toolkit';

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

export { flattenObject };

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
//       ? `${CurrentDepth['length'] extends 0 ? UnCapitalize<K & string> : Capitalize<K & string>}${keyof FlattenDepth<T[K], Depth, [...CurrentDepth, 1]> extends string ? Capitalize<keyof FlattenDepth<T[K], Depth, [...CurrentDepth, 1]>> : ''}`
//       : `${CurrentDepth['length'] extends 0 ? UnCapitalize<K & string> : Capitalize<K & string>}`]: CurrentDepth['length'] extends Depth
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
