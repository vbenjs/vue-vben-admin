import { appStore } from '/@/store/modules/app';
import { tryOnUnmounted } from '/@/utils/helper/vueHelper';
export function useTransition() {
  function handleAfterEnter() {
    const { openRouterTransition, openPageLoading } = appStore.getProjectConfig;

    if (!openRouterTransition || !openPageLoading) return;
    // Close loading after the route switching animation ends
    appStore.setPageLoadingAction(false);
  }

  tryOnUnmounted(() => {
    handleAfterEnter();
    stop();
  });

  return {
    handleAfterEnter,
    on: {
      onAfterEnter: handleAfterEnter,
    },
  };
}
