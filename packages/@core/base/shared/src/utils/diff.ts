// type Diff<T = any> = T;

// 比较两个数组是否相等（忽略顺序）

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const counter = new Map<T, number>();
  for (const value of a) {
    counter.set(value, (counter.get(value) || 0) + 1);
  }
  for (const value of b) {
    const count = counter.get(value);
    if (count === undefined || count === 0) {
      return false;
    }
    counter.set(value, count - 1);
  }
  return true;
}

// 比较两个数组是否相等（顺序敏感）
function arraysStrictEqual<T>(a: T[], b: T[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

// 深度对比两个值
// function deepEqual<T>(oldVal: T, newVal: T): boolean {
//   if (
//     typeof oldVal === 'object' &&
//     oldVal !== null &&
//     typeof newVal === 'object' &&
//     newVal !== null
//   ) {
//     return Array.isArray(oldVal) && Array.isArray(newVal)
//       ? arraysEqual(oldVal, newVal)
//       : diff(oldVal as any, newVal as any) === null;
//   } else {
//     return oldVal === newVal;
//   }
// }

// // diff 函数
// function diff<T extends object>(
//   oldObj: T,
//   newObj: T,
//   ignoreFields: (keyof T)[] = [],
// ): { [K in keyof T]?: Diff<T[K]> } | null {
//   const difference: { [K in keyof T]?: Diff<T[K]> } = {};

//   for (const key in oldObj) {
//     if (ignoreFields.includes(key)) continue;
//     const oldValue = oldObj[key];
//     const newValue = newObj[key];

//     if (!deepEqual(oldValue, newValue)) {
//       difference[key] = newValue;
//     }
//   }

//   return Object.keys(difference).length === 0 ? null : difference;
// }

type DiffResult<T> = Partial<{
  [K in keyof T]: T[K] extends object ? DiffResult<T[K]> : T[K];
}>;

type ArrayComparator = (a: any[], b: any[]) => boolean;

function createDiff(arrayEquals: ArrayComparator) {
  return function <T extends Record<string, any>>(
    obj1: T,
    obj2: T,
  ): DiffResult<T> {
    function findDifferences(o1: any, o2: any): any {
      if (Array.isArray(o1) && Array.isArray(o2)) {
        if (!arrayEquals(o1, o2)) {
          return o2;
        }
        return undefined;
      }

      if (
        typeof o1 === 'object' &&
        typeof o2 === 'object' &&
        o1 !== null &&
        o2 !== null
      ) {
        const diffResult: any = {};

        const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);
        keys.forEach((key) => {
          const valueDiff = findDifferences(o1[key], o2[key]);
          if (valueDiff !== undefined) {
            diffResult[key] = valueDiff;
          }
        });

        return Object.keys(diffResult).length > 0 ? diffResult : undefined;
      }

      return o1 === o2 ? undefined : o2;
    }

    return findDifferences(obj1, obj2);
  };
}

// 数组比较（不含顺序）
const diff = createDiff(arraysEqual);

// 数组比较（含顺序）
const diffStrict = createDiff(arraysStrictEqual);

export { arraysEqual, arraysStrictEqual, diff, diffStrict };
