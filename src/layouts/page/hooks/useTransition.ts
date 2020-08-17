import { AuthModeEnum } from '@/enums/appEnum';
import { watch, onUnmounted, unref, onMounted } from 'compatible-vue';
import { appStore } from '@/store/modules/app';
import { tabStore } from '@/store/modules/tab';
import { useRouter } from '@/hooks/core/useRouter';

export function useTransition() {
  let isFirstLoad = true;
  const { routeRef } = useRouter();
  watch(
    () => unref(routeRef).path,
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

  onMounted(() => {
    // 权限模式为后台的时候loading去除
    setTimeout(() => {
      const { getProjCfg } = appStore;
      const { authMode } = getProjCfg;

      if (AuthModeEnum.BACK === authMode) {
        appStore.setPageLoadingAction(false);
      }
    }, 0);
  });
  onUnmounted(() => {
    handleAfterEnter();
  });
  return {
    handleAfterEnter,
    on: {
      'after-enter': handleAfterEnter,
    },
  };
}
