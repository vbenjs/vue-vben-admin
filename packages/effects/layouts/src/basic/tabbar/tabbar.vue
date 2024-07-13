<script lang="ts" setup>
import { useRoute } from 'vue-router';

import { preferences } from '@vben-core/preferences';
import { useCoreTabbarStore } from '@vben-core/stores';
import { TabsView } from '@vben-core/tabs-ui';

import { useTabs } from './use-tabs';

defineOptions({
  name: 'LayoutTabbar',
});

defineProps<{ showIcon?: boolean }>();

const route = useRoute();

const coreTabbarStore = useCoreTabbarStore();

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
  handleUnpinTab,
} = useTabs();

// 刷新后如果不保持tab状态，关闭其他tab
if (!preferences.tabbar.persist) {
  coreTabbarStore.closeOtherTabs(route);
}
</script>

<template>
  <TabsView
    :active="currentActive"
    :menus="createContextMenus"
    :show-icon="showIcon"
    :tabs="currentTabs"
    @close="handleClose"
    @unpin-tab="handleUnpinTab"
    @update:active="handleClick"
  />
</template>
