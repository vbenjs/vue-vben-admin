import { nextTick, ref } from 'vue';

type El = Element | null | undefined;

export function useTabsViewScroll(scrollDistance: number = 150) {
  const scrollbarEl = ref<El>(null);
  const scrollViewportEl = ref<El>(null);

  function getScrollClientWidth() {
    if (!scrollbarEl.value || !scrollViewportEl.value) return {};

    const scrollbarWidth = scrollbarEl.value.clientWidth;
    const scrollViewWidth = scrollViewportEl.value.clientWidth;

    return {
      scrollbarWidth,
      scrollViewWidth,
    };
  }

  function scrollDirection(
    direction: 'left' | 'right',
    distance: number = scrollDistance,
  ) {
    const { scrollbarWidth, scrollViewWidth } = getScrollClientWidth();

    if (!scrollbarWidth || !scrollViewWidth) return;

    if (scrollbarWidth > scrollViewWidth) return;

    scrollViewportEl.value?.scrollBy({
      behavior: 'smooth',
      left:
        direction === 'left'
          ? -(scrollbarWidth - distance)
          : +(scrollbarWidth - distance),
    });
  }

  async function initScrollbar() {
    await nextTick();
    const barEl = document.querySelector('#tabs-scrollbar');

    const viewportEl = barEl?.querySelector(
      'div[data-radix-scroll-area-viewport]',
    );

    scrollbarEl.value = barEl;
    scrollViewportEl.value = viewportEl;

    const activeItem = viewportEl?.querySelector('.is-active');
    activeItem?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return {
    initScrollbar,
    scrollDirection,
  };
}
