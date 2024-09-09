/**
 * Returns the parent node of the given element or the document body if the element is not provided.it
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}
