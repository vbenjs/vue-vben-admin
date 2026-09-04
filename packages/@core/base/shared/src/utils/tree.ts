interface TreeConfigOptions {
  // 子属性的名称，默认为'children'
  childProps: string;
}

/**
 * @zh_CN 遍历树形结构，并返回所有节点中指定的值。
 * @param tree 树形结构数组
 * @param getValue 获取节点值的函数
 * @param options 作为子节点数组的可选属性名称。
 * @returns 所有节点中指定的值的数组
 */
function traverseTreeValues<T, V>(
  tree: T[],
  getValue: (node: T) => V,
  options?: TreeConfigOptions,
): V[] {
  const result: V[] = [];
  const { childProps } = options || {
    childProps: 'children',
  };

  const dfs = (treeNode: T) => {
    const value = getValue(treeNode);
    result.push(value);
    const children = (treeNode as Record<string, any>)?.[childProps];
    if (!children) {
      return;
    }
    if (children.length > 0) {
      for (const child of children) {
        dfs(child);
      }
    }
  };

  for (const treeNode of tree) {
    dfs(treeNode);
  }
  return result.filter(Boolean);
}

/**
 * 根据条件过滤给定树结构的节点，并以原有顺序返回所有匹配节点的数组。
 *
 * 该函数是纯函数：不会修改传入的树，也不会把源节点直接放进结果里。
 * 否则第二次用不同条件过滤同一棵树时（例如切换用户角色后重新生成路由），
 * 上一次被过滤掉的子节点将永久丢失。
 *
 * @param tree 要过滤的树结构的根节点数组。
 * @param filter 用于匹配每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 * @returns 包含所有匹配节点的数组。
 */
function filterTree<T extends Record<string, any>>(
  tree: T[],
  filter: (node: T) => boolean,
  options?: TreeConfigOptions,
): T[] {
  const { childProps } = options || {
    childProps: 'children',
  };

  const _filterTree = (nodes: T[]): T[] => {
    const result: T[] = [];

    for (const node of nodes) {
      if (!filter(node)) {
        continue;
      }

      const children = (node as Record<string, any>)[childProps];

      // 只在需要替换子节点时才复制节点，避免污染源数据
      result.push(
        children ? { ...node, [childProps]: _filterTree(children) } : node,
      );
    }

    return result;
  };

  return _filterTree(tree);
}

/**
 * 根据条件重新映射给定树结构的节
 * @param tree 要过滤的树结构的根节点数组。
 * @param mapper 用于map每个节点的条件。
 * @param options 作为子节点数组的可选属性名称。
 */
function mapTree<T, V extends Record<string, any>>(
  tree: T[],
  mapper: (node: T, parent: null | V) => V,
  options?: TreeConfigOptions,
  parent: null | V = null,
): V[] {
  const { childProps } = options || {
    childProps: 'children',
  };
  return tree.map((node) => {
    const mapperNode: Record<string, any> = mapper(node, parent as null | V);
    if (mapperNode[childProps]) {
      mapperNode[childProps] = mapTree(
        mapperNode[childProps],
        mapper,
        options,
        mapperNode as V,
      );
    }
    return mapperNode as V;
  });
}

/**
 * 对树形结构数据进行递归排序
 * @param treeData - 树形数据数组
 * @param sortFunction - 排序函数，用于定义排序规则
 * @param options - 配置选项，包括子节点属性名
 * @returns 排序后的树形数据
 */
function sortTree<T extends Record<string, any>>(
  treeData: T[],
  sortFunction: (a: T, b: T) => number,
  options?: TreeConfigOptions,
): T[] {
  const { childProps } = options || {
    childProps: 'children',
  };

  return treeData.toSorted(sortFunction).map((item) => {
    const children = item[childProps];
    if (children && Array.isArray(children) && children.length > 0) {
      return {
        ...item,
        [childProps]: sortTree(children, sortFunction, options),
      };
    }
    return item;
  });
}

export { filterTree, mapTree, sortTree, traverseTreeValues };
