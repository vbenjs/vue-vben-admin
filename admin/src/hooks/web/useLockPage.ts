import { computed, onUnmounted, unref, watchEffect } from 'vue'
import { useThrottleFn } from '@admin/use'
import { useAppStore } from '@/store/app'
import { useLockStore } from '@/store/lock'
import { useUserStore } from '@/store/user'
import { useRootSetting } from '../setting/useRootSetting'

export function useLockPage() {
  const { getLockTime } = useRootSetting()
  const lockStore = useLockStore()
  const userStore = useUserStore()
  const appStore = useAppStore()

  let timeId: TimeoutHandle

  function clear(): void {
    window.clearTimeout(timeId)
  }

  function resetCalcLockTimeout(): void {
    // not login
    if (!userStore.getToken) {
      clear()
      return
    }
    const lockTime = appStore.getProjectConfig.lockTime
    if (!lockTime || lockTime < 1) {
      clear()
      return
    }
    clear()

    timeId = setTimeout(() => {
      lockPage()
    }, lockTime * 60 * 1000)
  }

  function lockPage(): void {
    lockStore.setLockInfo({
      isLock: true,
      pwd: undefined,
    })
  }

  watchEffect((onClean) => {
    if (userStore.getToken) {
      resetCalcLockTimeout()
    } else {
      clear()
    }
    onClean(() => {
      clear()
    })
  })

  onUnmounted(() => {
    clear()
  })

  const keyupFn = useThrottleFn(resetCalcLockTimeout, 2000)

  return computed(() => {
    if (unref(getLockTime)) {
      return { onKeyup: keyupFn, onMousemove: keyupFn }
    } else {
      clear()
      return {}
    }
  })
}
