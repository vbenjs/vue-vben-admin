import { watch, onUnmounted, unref } from '@/setup/vue';
import { appStore } from '@/store/modules/app';
import { tabStore } from '@/store/modules/tab';
import { useRouter } from '@/hooks/core/useRouter';

export function useTransition() {
  let isFirstLoad = true;
  const { route } = useRouter();
  watch(
    () => unref(route).path,
    (path: string) => {
      const { getProjCfg } = appStore;
      const { openKeepAlive, multiTabsSetting: { show } = {} } = getProjCfg;
      if (show && openKeepAlive && !isFirstLoad) {
        const tabList = tabStore.getTabsState;
        const isOpen = tabList.some((tab) => tab.path === path);
        appStore.setPageLoadingAction(!isOpen);
      } else {
        appStore.setPageLoadingAction(true);
        isFirstLoad = false;
      }
    },
    {
      immediate: true,
    }
  );
  function handleAfterEnter() {
    // 路由切换动画结束之后关闭loading
    appStore.setPageLoadingAction(false);
  }
  onUnmounted(() => {
    handleAfterEnter();
  });
  return { handleAfterEnter };
}
