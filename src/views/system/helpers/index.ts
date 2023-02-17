import TreeNode from '/@/apis/TreeNode';
import { TreeItem } from '/@/components/Tree';

export function treeNode2TreeData(treeNodes: TreeNode[]): TreeItem[] {
  const result: TreeItem[] = [];
  treeNodes.forEach((node) => {
    const temp: TreeItem = { key: node.id, title: node.name };
    if (node.children) {
      temp.children = treeNode2TreeData(node.children);
    }
    result.push(temp);
  });
  return result;
}
