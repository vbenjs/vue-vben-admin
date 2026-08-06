import { computed, nextTick, shallowRef } from 'vue';

import {
  getLayoutScrollElement,
  getScrollbarWidth,
  needsScrollbar,
} from '@vben-core/shared/utils';

import {
  useScrollLock as _useScrollLock,
  tryOnBeforeUnmount,
  tryOnMounted,
} from '@vueuse/core';

export const SCROLL_FIXED_CLASS = `_scroll__fixed_`;

interface ScrollLockOptions {
  immediate?: boolean;
}

function getScrollLockTarget() {
  return getLayoutScrollElement() ?? document.body;
}

function getLayoutFixedNodes() {
  return [...document.querySelectorAll<HTMLElement>(`.${SCROLL_FIXED_CLASS}`)];
}

export function useScrollLock(options: ScrollLockOptions = {}) {
  const { immediate = true } = options;
  const lockTarget = shallowRef<HTMLElement | null>(null);
  const isTargetLocked = _useScrollLock(lockTarget);
  const scrollbarWidth = getScrollbarWidth();
  let hasScrollbarCompensation = false;
  let hasScrollbarGutter = false;

  function applyScrollbarGutter(target: HTMLElement) {
    if (target === document.body) {
      return;
    }

    target.dataset.scrollbarGutter =
      target.style.getPropertyValue('scrollbar-gutter');
    target.style.setProperty('scrollbar-gutter', 'stable');
    hasScrollbarGutter = true;
  }

  function resetScrollbarGutter(target: HTMLElement) {
    if (!hasScrollbarGutter) {
      return;
    }

    const scrollbarGutter = target.dataset.scrollbarGutter;
    if (scrollbarGutter) {
      target.style.setProperty('scrollbar-gutter', scrollbarGutter);
    } else {
      target.style.removeProperty('scrollbar-gutter');
    }
    delete target.dataset.scrollbarGutter;
    hasScrollbarGutter = false;
  }

  function applyScrollbarCompensation(target: HTMLElement) {
    if (target !== document.body || !needsScrollbar()) {
      return;
    }

    target.style.paddingRight = `${scrollbarWidth}px`;

    const nodes = getLayoutFixedNodes();
    if (nodes.length > 0) {
      nodes.forEach((node) => {
        node.dataset.transition = node.style.transition;
        node.style.transition = 'none';
        node.style.paddingRight = `${scrollbarWidth}px`;
      });
    }
    hasScrollbarCompensation = true;
  }

  function resetScrollbarCompensation(target: HTMLElement) {
    if (!hasScrollbarCompensation) {
      return;
    }

    const nodes = getLayoutFixedNodes();
    if (nodes.length > 0) {
      nodes.forEach((node) => {
        node.style.paddingRight = '';
        requestAnimationFrame(() => {
          node.style.transition = node.dataset.transition || '';
        });
      });
    }
    target.style.paddingRight = '';
    hasScrollbarCompensation = false;
  }

  const isLocked = computed({
    get() {
      return isTargetLocked.value;
    },
    set(value: boolean) {
      const target = lockTarget.value ?? getScrollLockTarget();
      lockTarget.value = target;

      if (value) {
        if (isTargetLocked.value) {
          return;
        }
        if (needsScrollbar(target)) {
          applyScrollbarGutter(target);
          applyScrollbarCompensation(target);
        }
        isTargetLocked.value = true;
        return;
      }

      isTargetLocked.value = false;
      resetScrollbarCompensation(target);
      resetScrollbarGutter(target);
    },
  });

  tryOnMounted(async () => {
    const target = getScrollLockTarget();
    lockTarget.value = target;
    await nextTick();

    if (immediate && needsScrollbar(target)) {
      isLocked.value = true;
    }
  });

  tryOnBeforeUnmount(() => {
    isLocked.value = false;
  });

  return isLocked;
}
