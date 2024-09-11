import { ref, computed, unref } from 'vue';
import { createPageContext } from '@/hooks/component/usePageContext';
import { useWindowSizeFn } from '@vben/hooks';

const headerHeightRef = ref(0);
const footerHeightRef = ref(0);

export function useLayoutHeight() {
  function setHeaderHeight(val) {
    headerHeightRef.value = val;
  }
  function setFooterHeight(val) {
    footerHeightRef.value = val;
  }
  return { headerHeightRef, footerHeightRef, setHeaderHeight, setFooterHeight };
}

export function useContentViewHeight() {
  const contentHeight = ref(window.innerHeight);
  const pageHeight = ref(window.innerHeight);
  const getViewHeight = computed(() => {
    return unref(contentHeight) - unref(headerHeightRef) - unref(footerHeightRef) || 0;
  });

  useWindowSizeFn(
    () => {
      contentHeight.value = window.innerHeight;
    },
    { wait: 100, immediate: true },
  );

  async function setPageHeight(height: number) {
    pageHeight.value = height;
  }

  createPageContext({
    contentHeight: getViewHeight,
    setPageHeight,
    pageHeight,
  });
}
