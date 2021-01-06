import type { MultiTabsSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

const getMultipleTabSetting = computed(() => appStore.getProjectConfig.multiTabsSetting);

const getShowMultipleTab = computed(() => unref(getMultipleTabSetting).show);

const getShowQuick = computed(() => unref(getMultipleTabSetting).showQuick);

const getShowRedo = computed(() => unref(getMultipleTabSetting).showRedo);

const getShowFold = computed(() => unref(getMultipleTabSetting).showFold);

function setMultipleTabSetting(multiTabsSetting: Partial<MultiTabsSetting>) {
  appStore.commitProjectConfigState({ multiTabsSetting });
}

export function useMultipleTabSetting() {
  return {
    setMultipleTabSetting,

    getMultipleTabSetting,
    getShowMultipleTab,
    getShowQuick,
    getShowRedo,
    getShowFold,
  };
}
