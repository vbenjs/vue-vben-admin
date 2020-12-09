import { computed, onUnmounted, unref, watchEffect } from 'vue';
import { useThrottle } from '/@/hooks/core/useThrottle';

import { appStore } from '/@/store/modules/app';
import { lockStore } from '/@/store/modules/lock';
import { userStore } from '/@/store/modules/user';
import { useRootSetting } from '../setting/useRootSetting';

export function useLockPage() {
  const { getLockTime } = useRootSetting();
  let timeId: TimeoutHandle;

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
    lockStore.commitLockInfoState({
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
    if (unref(getLockTime)) {
      return { onKeyup: keyupFn, onMousemove: keyupFn };
    } else {
      clear();
      return {};
    }
  });
}

export const getIsLock = computed(() => {
  const { getLockInfo } = lockStore;
  const { isLock } = getLockInfo;
  return isLock;
});
