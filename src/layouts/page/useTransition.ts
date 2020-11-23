import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { appStore } from '/@/store/modules/app';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';

export function useTransition() {
  function handleAfterEnter() {
    const { getOpenPageLoading, getOpenRouterTransition } = useRootSetting();
    if (!getOpenPageLoading.value || !getOpenRouterTransition.value) return;
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
