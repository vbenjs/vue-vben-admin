/**
 * triggter window.resize
 */
export function triggerWindowResize() {
  const event = document.createEvent('HTMLEvents');
  event.initEvent('resize', true, true);
  (event as ChangeEvent).eventType = 'message';
  window.dispatchEvent(event);
}
