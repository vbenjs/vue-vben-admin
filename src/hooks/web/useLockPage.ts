import { computed, onUnmounted, watchEffect } from 'vue';
import { useThrottle } from '/@/hooks/core/useThrottle';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';

export function useLockPage() {
  let timeId: ReturnType<typeof setTimeout>;

  function clear(): void {
    window.clearTimeout(timeId);
  }

  function resetCalcLockTimeout(): void {
    // not login
    if (!userStore.getTokenState) {
      clear();
      return;
    }
    const lockTime = appStore.getProjectConfig.lockTime;
    if (!lockTime || lockTime < 1) {
      clear();
      return;
    }
    clear();

    timeId = setTimeout(() => {
      lockPage();
    }, lockTime * 60 * 1000);
  }

  function lockPage(): void {
    appStore.commitLockInfoState({
      isLock: true,
      pwd: undefined,
    });
  }

  watchEffect((onClean) => {
    if (userStore.getTokenState) {
      resetCalcLockTimeout();
    } else {
      clear();
    }
    onClean(() => {
      clear();
    });
  });

  onUnmounted(() => {
    clear();
  });

  const [keyupFn] = useThrottle(resetCalcLockTimeout, 2000);

  return computed(() => {
    const openLockPage = appStore.getProjectConfig.lockTime;
    if (openLockPage) {
      return { onKeyup: keyupFn, onMousemove: keyupFn };
    } else {
      clear();
      return {};
    }
  });
}
