import { ref } from 'vue';

type El = HTMLElement | null | undefined;

export function useTabViewScroll(scrollDistance: number = 150) {
  const scrollbarEl = ref<El>(null);
  const scrollViewportEl = ref<El>(null);

  function setScrollBarEl(el: El) {
    scrollbarEl.value = el;
  }

  function setScrollViewEl(el: El) {
    scrollViewportEl.value = el;
  }

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
      left: direction === 'left' ? -distance : +distance,
    });
  }

  return {
    scrollDirection,
    setScrollBarEl,
    setScrollViewEl,
  };
}
