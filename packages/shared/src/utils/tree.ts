/**
 * @description 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getChildNodes 获取子节点的函数
 * @param getValue 获取节点值的函数
 * @returns 所有节点中指定的值的数组
 */
function traverseTree<T, V>(
  tree: T[],
  getChildNodes: (node: T) => T[] | undefined,
  getValue: (node: T) => V,
): V[] {
  const result: V[] = [];

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = getChildNodes?.(treeNode);
    if (!children) {
      return;
    }
    if (children.length) {
      for (const child of children) {
        dfs(child);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result;
}

export { traverseTree };
