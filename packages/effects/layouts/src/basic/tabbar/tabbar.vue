<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useContentMaximize, useTabs } from '@vben-core/hooks';
import { preferences } from '@vben-core/preferences';
import { useCoreTabbarStore } from '@vben-core/stores';
import { TabsToolMore, TabsToolScreen, TabsView } from '@vben-core/tabs-ui';

import { useTabbar } from './use-tabbar';

defineOptions({
  name: 'LayoutTabbar',
});

defineProps<{ showIcon?: boolean; theme?: string }>();

const route = useRoute();
const coreTabbarStore = useCoreTabbarStore();
const { toggleMaximize } = useContentMaximize();
const { unpinTab } = useTabs();

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
} = useTabbar();

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
    :class="theme"
    :context-menus="createContextMenus"
    :dragable="preferences.tabbar.dragable"
    :show-icon="showIcon"
    :style-type="preferences.tabbar.styleType"
    :tabs="currentTabs"
    @close="handleClose"
    @sort-tabs="coreTabbarStore.sortTabs"
    @unpin="unpinTab"
    @update:active="handleClick"
  />
  <div class="flex-center h-full">
    <TabsToolMore :menus="menus" />
    <TabsToolScreen
      :screen="preferences.sidebar.hidden"
      @change="toggleMaximize"
      @update:screen="toggleMaximize"
    />
  </div>
</template>
