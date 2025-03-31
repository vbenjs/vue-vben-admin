/**
 * If the node is holding inside a form, return the form element,
 * otherwise return the parent node of the given element or
 * the document body if the element is not provided.
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (
    node?.closest('form') ?? (node?.parentNode as HTMLElement) ?? document.body
  );
}
