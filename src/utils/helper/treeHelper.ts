/**
 * @description:  数组转tree
 */
export function list2Tree<T>(
  data: any[],
  { id = 'id', parentId = 'parentId', children = 'children' }: { [key: string]: string } = {},
  parentIdRoot: string | null | number = null
): T[] {
  const tree: T[] = [];
  const childrenOf = {};
  let item: T;
  let idKey: string;
  let parentIdKey: string;

  for (let i = 0, length = data.length; i < length; i++) {
    item = data[i];
    idKey = item[id];
    parentIdKey = item[parentId] || parentIdRoot;
    childrenOf[idKey] = childrenOf[idKey] || [];
    item[children] = childrenOf[idKey];
    if (parentIdKey !== parentIdRoot) {
      childrenOf[parentIdKey] = childrenOf[parentIdKey] || [];
      childrenOf[parentIdKey].push(item);
    } else {
      tree.push(item);
    }
  }
  return tree;
}
// 扁平化
export function flatTreeData<T, K extends keyof T>(data: T[] = [], children: K): T[] {
  const flatArr: T[] = [];
  const setItem = (data, children) => {
    for (const item of data) {
      flatArr.push(item);
      if (item[children]) {
        setItem(item[children], children);
      }
    }
  };
  setItem(data, children);
  return flatArr;
}
/**
 * @description: 提取tree指定结构
 * @Date: 2019-06-10 18:28:11
 */
export function treeMap(treeData: any[], opt) {
  return treeData.map((item) => treeMapEach(item, opt));
}
/**
 * @description: 提取tree指定结构
 * @Date: 2019-06-10 18:28:11
 */
export function treeMapEach(
  data,
  { children = 'children', conversion }: { children: string; conversion: Fn }
) {
  const haveChildren = Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  if (haveChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((i) =>
        treeMapEach(i, {
          children,
          conversion,
        })
      ),
    };
  } else {
    return {
      ...conversionData,
    };
  }
}
