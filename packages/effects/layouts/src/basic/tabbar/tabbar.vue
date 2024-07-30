<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useContentMaximize, useTabs } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { useTabbarStore } from '@vben/stores';
import {
  TabsToolMore,
  TabsToolRefresh,
  TabsToolScreen,
  TabsView,
} from '@vben-core/tabs-ui';

import { useTabbar } from './use-tabbar';

defineOptions({
  name: 'LayoutTabbar',
});

defineProps<{ showIcon?: boolean; theme?: string }>();

const route = useRoute();
const tabbarStore = useTabbarStore();
const { toggleMaximize } = useContentMaximize();
const { refreshTab, unpinTab } = useTabs();

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
} = useTabbar();

const menus = computed(() => {
  const tab = tabbarStore.getTabByPath(currentActive.value);
  const menus = createContextMenus(tab);
  return menus.map((item) => {
    return {
      ...item,
      label: item.text,
      value: item.key,
    };
  });
});

// 刷新后如果不保持tab状态，关闭其他tab
if (!preferences.tabbar.persist) {
  tabbarStore.closeOtherTabs(route);
}
</script>

<template>
  <TabsView
    :active="currentActive"
    :class="theme"
    :context-menus="createContextMenus"
    :dragable="preferences.tabbar.dragable"
    :show-icon="showIcon"
    :style-type="preferences.tabbar.styleType"
    :tabs="currentTabs"
    @close="handleClose"
    @sort-tabs="tabbarStore.sortTabs"
    @unpin="unpinTab"
    @update:active="handleClick"
  />
  <div class="flex-center h-full">
    <TabsToolRefresh
      v-if="preferences.tabbar.showRefresh"
      @refresh="refreshTab"
    />
    <TabsToolMore v-if="preferences.tabbar.showMore" :menus="menus" />
    <TabsToolScreen
      v-if="preferences.tabbar.showMaximize"
      :screen="preferences.sidebar.hidden"
      @change="toggleMaximize"
      @update:screen="toggleMaximize"
    />
  </div>
</template>
