import type { TransitionSetting } from '@vben-admin/types'

import { computed } from 'vue'

import { useAppStore } from '@/store/app'

export function useTransitionSetting() {
  const appStore = useAppStore()

  const getEnableTransition = computed(
    () => appStore.getTransitionSetting?.enable,
  )

  const getOpenNProgress = computed(
    () => appStore.getTransitionSetting?.openNProgress,
  )

  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getTransitionSetting?.openPageLoading
  })

  const getBasicTransition = computed(
    () => appStore.getTransitionSetting?.basicTransition,
  )

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.setProjectConfig({ transitionSetting })
  }
  return {
    setTransitionSetting,

    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  }
}
