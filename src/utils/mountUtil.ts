/**
 * @description:  设置ui挂载节点
 */
export function getPopupContainer(node?: HTMLElement): (Node & ParentNode) | null {
  if (node) {
    return node.parentNode;
  }
  return document.body;
}
