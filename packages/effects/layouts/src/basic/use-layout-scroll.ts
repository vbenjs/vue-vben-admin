import type { Router } from 'vue-router';

import { nextTick, onScopeDispose } from 'vue';
import { useRouter } from 'vue-router';

import { getLayoutScrollElement } from '@vben-core/shared/utils';

type LayoutScrollRouter = Pick<Router, 'afterEach' | 'beforeEach'>;

function getHistoryPosition() {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const position = (window.history.state as null | { position?: unknown })
    ?.position;
  return typeof position === 'number' ? position : undefined;
}

function getHashTarget(scrollElement: HTMLElement, hash: string) {
  if (!hash.startsWith('#')) {
    return null;
  }

  const id = hash.slice(1);
  try {
    return scrollElement.querySelector<HTMLElement>(
      `#${CSS.escape(decodeURIComponent(id))}`,
    );
  } catch {
    return scrollElement.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
  }
}

export function useLayoutScroll(router: LayoutScrollRouter = useRouter()) {
  const scrollPositions = new Map<number, number>();
  let currentHistoryPosition = getHistoryPosition();
  let isHistoryNavigation = false;

  const removeBeforeGuard = router.beforeEach(() => {
    const scrollElement = getLayoutScrollElement();
    if (scrollElement && currentHistoryPosition !== undefined) {
      scrollPositions.set(currentHistoryPosition, scrollElement.scrollTop);
    }

    const nextHistoryPosition = getHistoryPosition();
    isHistoryNavigation =
      currentHistoryPosition !== undefined &&
      nextHistoryPosition !== undefined &&
      currentHistoryPosition !== nextHistoryPosition;
  });

  const removeAfterHook = router.afterEach(async (to, _from, failure) => {
    const nextHistoryPosition = getHistoryPosition();

    if (!failure) {
      await nextTick();
      const scrollElement = getLayoutScrollElement();
      if (scrollElement) {
        const savedPosition =
          isHistoryNavigation && nextHistoryPosition !== undefined
            ? scrollPositions.get(nextHistoryPosition)
            : undefined;

        if (savedPosition === undefined) {
          const hashTarget = getHashTarget(scrollElement, to.hash);
          if (hashTarget) {
            hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            scrollElement.scrollTo({ top: 0 });
          }
        } else {
          scrollElement.scrollTo({ top: savedPosition });
        }
      }
    }

    currentHistoryPosition = nextHistoryPosition;
    isHistoryNavigation = false;
  });

  onScopeDispose(() => {
    removeBeforeGuard();
    removeAfterHook();
  });
}
