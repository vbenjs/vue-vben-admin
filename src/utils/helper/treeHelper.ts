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
