import { isClient } from './is'

export type ResizableElement = CustomizedHTMLElement<{
  __resizeListeners__?: Array<(...args: unknown[]) => unknown>
  __ro__?: ResizeObserver
}>

const resizeHandler = (entries: ResizeObserverEntry[]) => {
  for (const entry of entries) {
    const listeners =
      (entry.target as ResizableElement).__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn) => {
        fn()
      })
    }
  }
}

export const addResizeListener = (
  element: ResizableElement,
  fn: (...args: unknown[]) => unknown,
) => {
  if (!isClient || !element) return
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    element.__ro__ = new ResizeObserver(resizeHandler)
    element.__ro__.observe(element)
  }
  element.__resizeListeners__.push(fn)
}

export const removeResizeListener = (
  element: ResizableElement,
  fn: (...args: unknown[]) => unknown,
) => {
  if (!element || !element.__resizeListeners__) return
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    element.__ro__?.disconnect()
  }
}

export const triggerWindowResize = () => {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  ;(event as any).eventType = 'message'
  window.dispatchEvent(event)
}
