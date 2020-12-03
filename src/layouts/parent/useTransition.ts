import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import { appStore } from '/@/store/modules/app';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';

export function useTransition() {
  function handleAfterEnter() {
    const { getOpenPageLoading, getEnableTransition } = useTransitionSetting();
    if (!getOpenPageLoading.value || !getEnableTransition.value) return;
    // Close loading after the route switching animation ends
    appStore.setPageLoadingAction(false);
  }

  tryOnUnmounted(() => {
    handleAfterEnter();
    stop();
  });

  return {
    onAfterEnter: handleAfterEnter,
  };
}
