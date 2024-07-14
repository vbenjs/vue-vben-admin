<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { preferences } from '@vben-core/preferences';
import { useCoreTabbarStore } from '@vben-core/stores';
import { TabsToolMore, TabsToolScreen, TabsView } from '@vben-core/tabs-ui';

import { updateContentScreen, useTabs } from './use-tabs';

defineOptions({
  name: 'LayoutTabbar',
});

defineProps<{ showIcon?: boolean }>();

const coreTabbarStore = useCoreTabbarStore();

const route = useRoute();

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
  handleUnpinTab,
} = useTabs();

const menus = computed(() => {
  return createContextMenus(route);
});

// 刷新后如果不保持tab状态，关闭其他tab
if (!preferences.tabbar.persist) {
  coreTabbarStore.closeOtherTabs(route);
}
</script>

<template>
  <TabsView
    :active="currentActive"
    :context-menus="createContextMenus"
    :dragable="preferences.tabbar.dragable"
    :show-icon="showIcon"
    :style-type="preferences.tabbar.styleType"
    :tabs="currentTabs"
    @close="handleClose"
    @sort-tabs="coreTabbarStore.sortTabs"
    @unpin="handleUnpinTab"
    @update:active="handleClick"
  />
  <div class="flex-center h-full">
    <TabsToolMore :menus="menus" />
    <TabsToolScreen
      :screen="preferences.sidebar.hidden"
      @change="updateContentScreen"
      @update:screen="updateContentScreen"
    />
  </div>
</template>
