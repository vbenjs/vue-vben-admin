/**
 * 获取元素可见高度
 * @param element
 */
function getElementVisibleHeight(
  element?: HTMLElement | null | undefined,
): number {
  if (!element) {
    return 0;
  }
  const rect = element.getBoundingClientRect();
  const viewHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight,
  );

  const top = Math.max(rect.top, 0);
  const bottom = Math.min(rect.bottom, viewHeight);

  return Math.max(0, bottom - top);
}

export { getElementVisibleHeight };
