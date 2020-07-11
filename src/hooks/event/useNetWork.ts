import { onMounted, onUnmounted, ref, watch, Ref } from '@/setup/vue';
//
import Router from 'vue-router';

import { isBoolean } from '@/utils/is/index';

import { PageEnum } from '@/enums/pageEnum';
import { ExceptionEnum } from '@/enums/exceptionEnum';

const ON_LINE = 'online';
const OFF_LINE = 'offline';
export function useNetWork(router: Router): void {
  const onLineRef = ref(navigator.onLine);

  // 断网时间
  const offlineAt: Ref<number | undefined> = ref(undefined);

  watch(
    () => onLineRef.value,
    (onLine, oldValue): void => {
      // 无网转有网
      if (isBoolean(oldValue) && !oldValue && onLine) {
        router.replace(PageEnum.BASE_HOME);
      } else if (isBoolean(onLine) && !onLine && oldValue) {
        // 有网转无网
        offlineAt.value = Date.now();
        router.replace({
          path: PageEnum.ERROR_PAGE,
          query: {
            status: String(ExceptionEnum.NET_WORK_ERROR),
          },
        });
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
