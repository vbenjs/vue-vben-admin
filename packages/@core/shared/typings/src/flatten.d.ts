// `Prev` 类型用于表示递归深度的递减。它是一个元组，其索引代表了递归的层数，通过索引访问可以得到减少后的层数。
// 例如，Prev[3] 等于 2，表示递归深度从 3 减少到 2。
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

// `FlattenDepth` 类型用于将一个嵌套的对象类型“展平”，同时考虑到了递归的深度。
// 它接受三个泛型参数：T（要处理的类型），Prefix（属性名前缀，默认为空字符串），Depth（递归深度，默认为3）。
// 如果当前深度（Depth）为 0，则停止递归并返回 `never`。否则，如果属性值是对象类型，则递归调用 `FlattenDepth` 并递减深度。
// 对于非对象类型的属性，将其直接映射到结果类型中，并根据前缀构造属性名。

type FlattenDepth<T, Prefix extends string = '', Depth extends number = 4> = {
  [K in keyof T]: T[K] extends object
    ? Depth extends 0
      ? never
      : FlattenDepth<
          T[K],
          `${Prefix}${K extends string ? (Prefix extends '' ? K : Capitalize<K>) : ''}`,
          Prev[Depth]
        >
    : {
        [P in `${Prefix}${K extends string ? (Prefix extends '' ? K : Capitalize<K>) : ''}`]: T[K];
      };
}[keyof T] extends infer O
  ? { [P in keyof O]: O[P] }
  : never;

// `UnionToIntersection` 类型用于将一个联合类型转换为交叉类型。
// 这个类型通过条件类型和类型推断的方式来实现。它先尝试将输入类型（U）映射为一个函数类型，
// 然后通过推断这个函数类型的返回类型（infer I），最终得到一个交叉类型。
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

type Flatten<T> = UnionToIntersection<FlattenDepth<T>>;

type FlattenObject<T> = FlattenDepth<T>;
type FlattenObjectKeys<T> = keyof FlattenObject<T>;

export type { Flatten, FlattenObject, FlattenObjectKeys, UnionToIntersection };
