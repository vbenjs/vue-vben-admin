import { computed } from 'vue';
import { appStore } from '/@/store/modules/app';

export function useSideBar() {
  const currentCollapsedRef = computed(() => {
    return appStore.getProjectConfig.menuSetting.collapsed;
  });
  const changeCollapsed = (collapsed: boolean) => {
    appStore.commitProjectConfigState({
      menuSetting: {
        collapsed: collapsed,
      },
    });
  };
  return {
    openSider: changeCollapsed(false),
    closeSider: changeCollapsed(true),
    currentCollapsedRef,
  };
}
