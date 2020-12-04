import type { MultiTabsSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

export function useMultipleTabSetting() {
  const getMultipleTabSetting = computed(() => appStore.getProjectConfig.multiTabsSetting);

  const getShowMultipleTab = computed(() => unref(getMultipleTabSetting).show);

  const getShowQuick = computed(() => unref(getMultipleTabSetting).showQuick);

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    appStore.commitProjectConfigState({ multiTabsSetting });
  }

  return {
    setMultipleTabSetting,

    getMultipleTabSetting,
    getShowMultipleTab,
    getShowQuick,
  };
}
