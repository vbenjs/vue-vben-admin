type Diff<T = any> = T;

// 比较两个数组是否相等

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

// 深度对比两个值
function deepEqual<T>(oldVal: T, newVal: T): boolean {
  if (
    typeof oldVal === 'object' &&
    oldVal !== null &&
    typeof newVal === 'object' &&
    newVal !== null
  ) {
    return Array.isArray(oldVal) && Array.isArray(newVal)
      ? arraysEqual(oldVal, newVal)
      : diff(oldVal as any, newVal as any) === null;
  } else {
    return oldVal === newVal;
  }
}

// 主要的 diff 函数
function diff<T extends object>(
  oldObj: T,
  newObj: T,
  ignoreFields: (keyof T)[] = [],
): { [K in keyof T]?: Diff<T[K]> } | null {
  const difference: { [K in keyof T]?: Diff<T[K]> } = {};

  for (const key in oldObj) {
    if (ignoreFields.includes(key)) continue;
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    if (!deepEqual(oldValue, newValue)) {
      difference[key] = newValue;
    }
  }

  return Object.keys(difference).length === 0 ? null : difference;
}

export { arraysEqual, diff };
