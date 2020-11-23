import type { MultiTabsSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

export function useMultipleTabSetting() {
  const getMultipleTabSetting = computed(() => appStore.getProjectConfig.multiTabsSetting);

  const getMax = computed(() => unref(getMultipleTabSetting).max);

  const getShow = computed(() => unref(getMultipleTabSetting).show);

  function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
    appStore.commitProjectConfigState({ multiTabsSetting });
  }

  return {
    setMultipleTabSetting,

    getMultipleTabSetting,
    getMax,
    getShow,
  };
}
