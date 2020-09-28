import { onUnmounted } from 'vue';
import { appStore } from '/@/store/modules/app';
export function useTransition() {
  function handleAfterEnter() {
    const { openRouterTransition, openPageLoading } = appStore.getProjectConfig;
    if (!openRouterTransition || !openPageLoading) return;
    // 路由切换动画结束之后关闭loading
    appStore.setPageLoadingAction(false);
  }

  onUnmounted(() => {
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
