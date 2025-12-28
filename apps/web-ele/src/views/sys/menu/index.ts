import type { MenuData } from '#/api/core/menu';

interface RowType {
  id: number;
  pid: null | number;
  name: string;
  url: string;
  type: 0 | 1 | 2;
  sort: number;
  createTime: null | string;
  parentName: null | string;
  icon: string;
  meta: {
    authority: null | string;
    icon: string;
    title: string;
  };
  children: [] | RowType[];
}

/**
 * 转换后端数据为表格展示数据
 * @param item - 菜单数据
 */
function transformationBackendToTable(item: MenuData): RowType {
  const { id, pid, name, url, type, sort, createTime, parentName, meta, icon } =
    item;
  const children =
    Array.isArray(item.children) && item.children.length > 0
      ? item.children.map((child) => transformationBackendToTable(child))
      : [];
  return {
    id,
    pid,
    name,
    url,
    type,
    sort,
    createTime,
    parentName,
    meta,
    children,
    icon,
  };
}

/**
 * 构建节点映射
 * @param data - 树形节点数据
 * @returns 以 id 为键的节点映射
 */
function buildNodeMap(data: RowType[]) {
  const storeMap = new Map<number, RowType>();
  const traverse = (nodes: RowType[]) => {
    for (const node of nodes) {
      storeMap.set(node.id, node);
      if (Array.isArray(node.children) && node.children.length > 0) {
        traverse(node.children);
      }
    }
  };
  traverse(data);
  return storeMap;
}

/**
 * 寻找节点的所有父级节点的id
 * @param id - 节点id
 * @param data - 数据节点数据
 */
function findNodeParentId(id: number, data: RowType[]) {
  const nodesMap = buildNodeMap(data);
  // 处理异常情况
  if (data.length === 0) return [];
  if (!nodesMap.has(id)) return [];
  const ids = [id];
  let currentNode = nodesMap.get(id) as RowType;
  while (currentNode?.pid !== null) {
    const parentNode = nodesMap.get(currentNode.pid);
    if (!parentNode) {
      break;
    }

    ids.unshift(parentNode.id);
    currentNode = parentNode;
  }
  return ids;
}

/**
 * 获取该节点的完整路径
 * @param { object } params  - 传递参数对象
 * @param { any[] } params.data  - 传递参数对象
 * @param { number } params.id - 数据节点数据
 * @param { object } params.options  - 配置项
 * @returns 节点完整路径
 */
function getFullPath({
  id,
  data,
  options,
}: {
  data: RowType[];
  id: number;
  options: {
    extractVal: 'meta.title' | 'url';
    returnVal?: 'nodes' | 'result';
  };
}) {
  if (data.length === 0) return;
  const { extractVal, returnVal } = options;
  const nodesMap = buildNodeMap(data);
  const ids = findNodeParentId(id, data);
  const res: { nodes: string[]; result: string } = { nodes: [], result: '' };
  switch (extractVal) {
    case 'meta.title': {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.nodes = ids.map((id) => nodesMap.get(id)!.meta!.title);
      res.result = res.nodes.join('-');
      break;
    }
    case 'url': {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      res.nodes = ids.map((id) => nodesMap.get(id)!.url);
      const urlPath = res.nodes.join('/');
      res.result = urlPath.slice(-1) === '/' ? urlPath.slice(0, -1) : urlPath;
      break;
    }
    default: {
      return res as never;
    }
  }

  if (returnVal) {
    return res[returnVal];
  }
  return res;
}

export {
  buildNodeMap,
  findNodeParentId,
  getFullPath,
  type RowType,
  transformationBackendToTable,
};
