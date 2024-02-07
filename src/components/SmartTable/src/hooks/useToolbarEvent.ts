import type { VxeGridListeners } from 'vxe-table';
import { computed } from 'vue';

import { SmartTableCode } from '../const';

interface Action {
  setSearchFormVisible: (visible?: boolean) => void;
}

export const useToolbarEvent = (emit: Function, { setSearchFormVisible }: Action) => {
  const events: VxeGridListeners = {
    toolbarToolClick: (params) => {
      emit('toolbar-tool-click', params);
      const { code } = params;
      switch (code) {
        case SmartTableCode.showSearch: {
          setSearchFormVisible();
          break;
        }
      }
    },
  };

  const getToolbarEvents = computed(() => {
    const result: any = {};
    Object.keys(events).forEach((item) => {
      result[`on${item.slice(0, 1).toUpperCase() + item.slice(1)}`] = events[item];
    });
    return result;
  });

  return {
    getToolbarEvents,
  };
};
