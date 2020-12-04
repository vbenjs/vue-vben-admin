import type { TransitionSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

export function useTransitionSetting() {
  const getTransitionSetting = computed(() => appStore.getProjectConfig.transitionSetting);

  const getEnableTransition = computed(() => unref(getTransitionSetting)?.enable);

  const getOpenNProgress = computed(() => unref(getTransitionSetting)?.openNProgress);

  const getOpenPageLoading = computed((): boolean => {
    return !!unref(getTransitionSetting)?.openPageLoading;
  });

  const getBasicTransition = computed(() => unref(getTransitionSetting)?.basicTransition);

  function setTransitionSetting(transitionSetting: Partial<TransitionSetting>) {
    appStore.commitProjectConfigState({ transitionSetting });
  }

  return {
    setTransitionSetting,

    getTransitionSetting,
    getEnableTransition,
    getOpenNProgress,
    getOpenPageLoading,
    getBasicTransition,
  };
}
