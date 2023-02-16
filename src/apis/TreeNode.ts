export default interface TreeNode {
  id: string;
  name: string;
  data: object;
  parentId: string;
  children: TreeNode[];
}
