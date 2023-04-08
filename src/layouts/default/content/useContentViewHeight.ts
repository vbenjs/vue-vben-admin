import { useWindowSizeFn } from '@vben/hooks';
import { ref } from 'vue';

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

  useWindowSizeFn(
    () => {
      contentHeight.value = window.innerHeight;
    },
    { wait: 100, immediate: true },
  );
}
