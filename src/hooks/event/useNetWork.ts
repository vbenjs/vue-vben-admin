import { onMounted, onUnmounted, ref, watch, Ref } from 'compatible-vue';

import { isBoolean } from '@/utils/is/index';

const ON_LINE = 'online';
const OFF_LINE = 'offline';
export function useNetWork({
  onLineFn,
  offLineFn,
}: {
  onLineFn?: () => void;
  offLineFn?: () => void;
}): void {
  const onLineRef = ref(navigator.onLine);

  // 断网时间
  const offlineAt: Ref<number | undefined> = ref(undefined);

  watch(
    () => onLineRef.value,
    (onLine, oldValue): void => {
      // 无网转有网
      if (isBoolean(oldValue) && !oldValue && onLine) {
        onLineFn && onLineFn();
      } else if (isBoolean(onLine) && !onLine && oldValue) {
        // 有网转无网
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
  onMounted(() => {
    window.addEventListener(ON_LINE, handler);
    window.addEventListener(OFF_LINE, handler);
  });
  onUnmounted(() => {
    window.removeEventListener(ON_LINE, handler);
    window.removeEventListener(OFF_LINE, handler);
  });
}
