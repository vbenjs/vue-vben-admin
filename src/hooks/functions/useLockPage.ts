import { onUnmounted, watch } from 'compatible-vue';
import { useThrottle } from '@/hooks/core/useThrottle';

import { appStore } from '@/store/modules/app';
import { userStore } from '@/store/modules/user';
export function useLockPage() {
  let timeId: ReturnType<typeof setTimeout>;

  function clear() {
    window.clearTimeout(timeId);
  }
  function resetCalcLockTimeout() {
    // not login
    if (!userStore.getTokenState) {
      clear();
      return;
    }
    const lockTime = appStore.getProjCfg.lockTime;
    if (!lockTime || lockTime < 1) {
      clear();
      return;
    }
    clear();

    timeId = setTimeout(() => {
      lockPage();
    }, lockTime * 60 * 1000);
  }

  function lockPage() {
    appStore.commitLockInfoState({
      isLock: true,
      pwd: undefined,
    });
  }

  watch(
    () => userStore.getTokenState,
    (token: string) => {
      if (token) {
        resetCalcLockTimeout();
      } else {
        clear();
      }
    },
    {
      immediate: true,
    }
  );
  onUnmounted(() => {
    clear();
  });
  const [keyupFn] = useThrottle(resetCalcLockTimeout, 1000);
  return {
    registerGlobOnKeyup: keyupFn,
    registerGlobOnMouseMove: keyupFn,
  };
}
