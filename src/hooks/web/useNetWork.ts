import type { Ref } from 'vue';

import { ref, watch } from 'vue';
import { tryOnMounted, tryOnUnmounted } from '/@/utils/helper/vueHelper';

import { isBoolean } from '/@/utils/is';

const ON_LINE = 'online';
const OFF_LINE = 'offline';
export function useNetWork({
  onLineFn,
  offLineFn,
}: {
  onLineFn?: () => void;
  offLineFn?: () => void;
}) {
  const onLineRef = ref(navigator.onLine);

  // Disconnect time
  const offlineAt: Ref<number | undefined> = ref(undefined);

  watch(
    () => onLineRef.value,
    (onLine, oldValue): void => {
      if (isBoolean(oldValue) && !oldValue && onLine) {
        onLineFn && onLineFn();
      } else if (isBoolean(onLine) && !onLine && oldValue) {
        // Network to no network
        offlineAt.value = Date.now();
        offLineFn && offLineFn();
      }
    },
    {
      immediate: false,
    }
  );

  const handler = (e: Event) => {
    const { type } = e;
    onLineRef.value = type === ON_LINE;
  };
  tryOnMounted(() => {
    window.addEventListener(ON_LINE, handler);
    window.addEventListener(OFF_LINE, handler);
  });
  tryOnUnmounted(() => {
    window.removeEventListener(ON_LINE, handler);
    window.removeEventListener(OFF_LINE, handler);
  });
  return {
    onLineRef,
  };
}
