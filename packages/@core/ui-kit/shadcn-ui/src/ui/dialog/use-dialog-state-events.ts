import type { Ref } from 'vue';

import { onScopeDispose, watch } from 'vue';

/**
 * 弹窗的 `closed`/`opened` 事件由内容元素自身的退出动画（`animationend`）确认。
 * 当动画被跳过或取消（reduced motion、动画被中断、关闭过程中 class 变化）时，
 * 事件永远不会触发——弹窗会一直保持可见，`hidden` class 不会被应用，
 * destroy-on-close 重挂载和 `onClosed` 监听器会一直挂起。这里对齐 reka-ui
 * Presence 的行为（`animationcancel` 视为结束），并在动画窗口结束后增加兜底
 * 触发，保证关闭链路始终恰好完成一次。
 */

/** 本仓库弹窗的退出动画时长为 150ms；300ms 可以安全覆盖。 */
const CLOSED_EVENT_FALLBACK_MS = 300;

export function useDialogStateEvents(options: {
  contentRef: Ref<null | { $el: Element | null }>;
  isOpen: () => boolean;
  onClosed: () => void;
  onOpened: () => void;
}) {
  const { contentRef, isOpen, onClosed, onOpened } = options;

  let closeFallbackTimer: null | ReturnType<typeof setTimeout> = null;
  let closeAcknowledged = false;

  function emitOpenStateChange() {
    if (closeFallbackTimer !== null) {
      clearTimeout(closeFallbackTimer);
      closeFallbackTimer = null;
    }
    if (isOpen()) {
      onOpened();
      return;
    }
    // 关闭已由动画事件或兜底确认——同一关闭周期内 `closed` 只触发一次。
    if (closeAcknowledged) {
      return;
    }
    closeAcknowledged = true;
    onClosed();
  }

  /**
   * 同时监听内容元素的 `animationend` 和 `animationcancel` ——被取消的动画
   * 同样视为结束（reka-ui 的 Presence 也是这么处理的），关闭链路不会一直等待。
   */
  function handleAnimationEvent(event: AnimationEvent) {
    if (event.target === contentRef.value?.$el) {
      emitOpenStateChange();
    }
  }

  watch(isOpen, (open) => {
    if (open) {
      closeAcknowledged = false;
      if (closeFallbackTimer !== null) {
        clearTimeout(closeFallbackTimer);
        closeFallbackTimer = null;
      }
      return;
    }
    // 启动兜底定时器：如果没有动画事件确认关闭（退出动画被跳过/取消），
    // 则在动画窗口结束后触发 `closed`。
    if (closeFallbackTimer === null) {
      closeFallbackTimer = setTimeout(() => {
        closeFallbackTimer = null;
        if (!isOpen()) {
          emitOpenStateChange();
        }
      }, CLOSED_EVENT_FALLBACK_MS);
    }
  });

  onScopeDispose(() => {
    if (closeFallbackTimer !== null) {
      clearTimeout(closeFallbackTimer);
      closeFallbackTimer = null;
    }
  });

  return { handleAnimationEvent };
}
