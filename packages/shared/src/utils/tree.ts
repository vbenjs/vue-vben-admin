import { isArray } from "./inference.ts";

/**
 * TreeHelperConfig interface defines the configuration for tree structure.
 * TreeHelperConfig 接口定义了树形结构的配置项。
 * @property idKey 节点标识符属性名，默认值为 "id"
 * @property childrenKey 子节点属性名，默认值为 "children"
 * @property parentKey 父节点标识符属性名，默认值为 "parentId"
 */
interface TreeHelperConfig<T = any> {
  idKey: keyof T;
  childrenKey: keyof T;
  parentKey: keyof T;
}

/**
 * 默认配置
 */
const DEFAULT_TREE_HELPER_CONFIG: TreeHelperConfig = {
  idKey: "id",
  childrenKey: "children",
  parentKey: "parentId",
};

/**
 * Get the TreeHelper configuration.
 * 获取 TreeHelper 配置。
 * @param config TreeHelperConfig configuration options 配置项
 * @returns TreeHelperConfig configuration
 */
const getTreeHelperConfig = (config: Partial<TreeHelperConfig>): TreeHelperConfig => ({ ...DEFAULT_TREE_HELPER_CONFIG, ...config });

/**
 * Convert a flat list to a tree structure.
 * 将列表转换为树形结构。
 * @param list Array<T> list to be converted to a tree structure. 要转换为树形结构的列表。
 * @param config Partial<TreeHelperConfig<T>> configuration options for TreeHelper. TreeHelper 的配置项。
 * @returns An array of type T[], where T extends TreeNode. 返回树形结构，其中 T 继承自 TreeNode。
 */
export function flattenToTree<T>(list: T[], config: Partial<TreeHelperConfig> = {}): T[] {
  const { idKey, childrenKey, parentKey } = getTreeHelperConfig(config);
  const nodeMap = new Map<T[keyof T], any>();
  const tree: T[] = [];

  // create node map
  for (const node of list) {
    const childrenNodes: T[] = node[childrenKey] || [];
    nodeMap.set(node[idKey], { ...node, [childrenKey]: childrenNodes });
  }

  // construct tree
  for (const node of nodeMap.values()) {
    const parent = nodeMap.get(node[parentKey]);
    if (parent) {
      parent[childrenKey].push(node);
    } else {
      tree.push(node);
    }
  }

  return tree;
}

/**
 * Convert a tree structure to a flat list.
 * 将树形结构转换为扁平列表。
 * @param tree The tree structure to be converted to a flat list. 要转换为扁平列表的树形结构。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns An array of type T[] containing the flattened nodes, where T extends TreeNode. 返回扁平化的节点列表，其中 T 继承自 TreeNode。
 */
export function flattenTree<T>(tree: T[], config: Partial<TreeHelperConfig> = {}): T[] {
  const { childrenKey } = getTreeHelperConfig(config);
  const flattenedNodes: T[] = [];

  function dfs(node: T) {
    flattenedNodes.push(node);
    const children = node[childrenKey];
    if (children) {
      for (const child of children) {
        dfs(child);
      }
    }
  }

  for (const node of tree) {
    dfs(node);
  }
  return flattenedNodes;
}

/**
 * Find the first node in the tree that satisfies the predicate.
 * 在树形结构中查找符合条件的第一个节点。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param predicate The predicate function to test each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns The first node in the tree that satisfies the predicate. 符合条件的第一个节点。
 */
export function findTreeNode<T>(
  treeData: T[],
  predicate: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T | null {
  const { childrenKey } = getTreeHelperConfig(config);
  for (const node of treeData) {
    if (predicate(node)) {
      return node;
    }

    const children = node[childrenKey];
    if (children) {
      const foundNode = findTreeNode(children, predicate, config);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
}

/**
 * Find all nodes in the tree that satisfy the predicate.
 * 在树形结构中查找符合条件的所有节点。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param predicate The predicate function to test each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns An array of nodes that satisfy the predicate. 符合条件的节点组成的数组。
 */
export function findTreeNodes<T>(
  treeData: T[],
  predicate: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const { childrenKey } = getTreeHelperConfig(config);
  const result: T[] = [];

  for (const node of treeData) {
    if (predicate(node)) {
      result.push(node);
    }

    const children = node[childrenKey];
    if (children) {
      const foundNodes = findTreeNodes(children, predicate, config);
      result.push(...foundNodes);
    }
  }

  return result;
}

/**
 * Find the path of the first node in the tree that satisfies the predicate.
 * 在树形结构中查找符合条件的第一个节点的路径。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param predicate The predicate function to test each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns The path to the first node in the tree that satisfies the predicate. 符合条件的第一个节点的路径。
 */
export function findFirstNodePath<T>(
  treeData: T[],
  predicate: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] | null {
  const { childrenKey } = getTreeHelperConfig(config);
  for (const node of treeData) {
    if (predicate(node)) {
      return [node];
    }

    const children = node[childrenKey];
    if (children) {
      const foundPath = findFirstNodePath(children, predicate, config);
      if (foundPath) {
        return [node, ...foundPath];
      }
    }
  }

  return null;
}

/**
 * Find the paths of all nodes in the tree that satisfy the predicate.
 * 在树形结构中查找符合条件的所有节点的路径。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param predicate The predicate function to test each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns An array of paths to the nodes that satisfy the predicate. 符合条件的节点的路径组成的数组。
 */
export function findAllNodePaths<T>(
  treeData: T[],
  predicate: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[][] {
  const { childrenKey } = getTreeHelperConfig(config);
  const result: T[][] = [];

  for (const node of treeData) {
    if (predicate(node)) {
      result.push([node]);
    }

    const children = node[childrenKey];
    if (children) {
      const foundPaths = findAllNodePaths(children, predicate, config);
      foundPaths.forEach(path => result.push([node, ...path]));
    }
  }

  return result;
}

/**
 * Filter the tree and return a new tree that only contains nodes and their ancestors that satisfy the predicate.
 * 过滤树形结构，只保留满足条件的节点及其祖先节点，并返回一个新的树形结构。
 * @param treeNodes The root nodes of the tree. 树形结构的根节点列表。
 * @param predicate The predicate function to test each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 * @returns A new tree that only contains nodes and their ancestors that satisfy the predicate.
 */
export function filterTree<T>(
  treeNodes: T[],
  predicate: (node: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const { childrenKey } = getTreeHelperConfig(config);
  function filterSubtree(nodes: T[]): T[] {
    return nodes
      .map(node => ({ ...node }))
      .filter((node) => {
        node[childrenKey] = node[childrenKey] && filterSubtree(node[childrenKey]);
        return predicate(node) || (node[childrenKey] && node[childrenKey].length);
      });
  }

  return filterSubtree(treeNodes);
}

/**
 * Recursively traverse all nodes in the tree and execute the callback function for each node.
 * 递归遍历树形结构中的所有节点，并对每个节点执行回调函数。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param callback The callback function to execute for each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 */
export function traverseTreeRecursive<T>(
  treeData: T[],
  callback: (node: T) => void,
  config: Partial<TreeHelperConfig> = {},
) {
  const { childrenKey } = getTreeHelperConfig(config);

  function dfs(node: T) {
    callback(node);
    const children = node[childrenKey] || [];
    for (const child of children) {
      dfs(child);
    }
  }

  for (const node of treeData) {
    dfs(node);
  }
}

/**
 * Iterative traverse all nodes in the tree and execute the callback function for each node.
 * 迭代遍历树形结构中的所有节点，并对每个节点执行回调函数。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param callback The callback function to execute for each node. 每个节点都会执行该回调函数。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 */
export function traverseTreeIterative<T>(
  treeData: T[],
  callback: (node: T) => void,
  config: Partial<TreeHelperConfig> = {},
): void {
  const { childrenKey } = getTreeHelperConfig(config);
  const stack: T[] = [...treeData];

  while (stack.length) {
    const node = stack.pop();
    if (node) {
      callback(node);
      const children = node[childrenKey] || [];
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i]);
      }
    }
  }
}

/**
 * Traverse all nodes in the tree iteratively and execute the callback function for each node, with both the node and its parent passed to the callback.
 * 迭代遍历树形结构中的所有节点，并对每个节点执行回调函数。同时，每个节点及其父节点都会被传递给回调函数。
 * @param treeData The root nodes of the tree. 树形结构的根节点列表。
 * @param callback The callback function to execute for each node. 每个节点都会执行该回调函数，第一个参数为节点本身，第二个参数为其父节点（如果存在）。
 * @param config The configuration for TreeHelper. 树形结构的配置项。
 */
export function traverseTreeIterativeWithParent<T>(
  treeData: T[],
  callback: (node: T, parent?: T) => void,
  config: Partial<TreeHelperConfig> = {},
): void {
  const { childrenKey } = getTreeHelperConfig(config);

  const stack: { node: T; parent?: T }[] = [];
  for (const node of treeData) {
    stack.push({ node, parent: undefined });
  }

  while (stack.length > 0) {
    const { node, parent } = stack.pop() || {};
    if (node) {
      const children = node[childrenKey] || [];
      callback(node, parent);
      for (const child of children) {
        stack.push({ node: child, parent: node });
      }
    }
  }
}

/**
 * @description: Maps a tree structure into a new tree structure with a specified structure.
 * @description: 将树形结构映射为具有指定结构的新树形结构。
 * @param {Array} treeData - The tree structure to map.
 * @param {Function} convertNodeToStructure - The function that converts a node in the original tree to a node in the new tree.
 * @param {Partial<TreeHelperConfig>} config - The configuration options for the tree helper.
 * @returns {Array} - The new tree structure.
 */
export function mapTreeStructure<T = any, R = any>(
  treeData: T[],
  convertNodeToStructure: (node: T) => Partial<R> & { [key: TreeHelperConfig["childrenKey"]]: any },
  config: Partial<TreeHelperConfig> = {},
) {
  return treeData.map(node => mapTreeNodeStructure(node, convertNodeToStructure, getTreeHelperConfig(config)));
}

/**
 * @description: Maps a single node in a tree structure into a new node with a specified structure.
 * @description: 将树形结构中的单个节点映射为具有指定结构的新节点。
 * @param {Object} node - The node to map.
 * @param {Function} convertNodeToStructure - The function that converts the node to a new node.
 * @param {TreeHelperConfig} config - The configuration options for the tree helper.
 * @returns {Object} - The new node.
 */
export function mapTreeNodeStructure<T = any, R = any>(
  node: T,
  convertNodeToStructure: (node: T) => Partial<R> & { [key: TreeHelperConfig["childrenKey"]]: any },
  config: Partial<TreeHelperConfig> = {},
) {
  const { childrenKey } = getTreeHelperConfig(config);
  const hasChildren = isArray(node[childrenKey]) && node[childrenKey].length > 0;
  const convertedNode = convertNodeToStructure(node) || {};
  if (hasChildren) {
    return {
      ...convertedNode,
      [childrenKey]: node[childrenKey].map(childNode => mapTreeNodeStructure(childNode, convertNodeToStructure, config)),
    };
  } else {
    return {
      ...convertedNode,
    };
  }
}
