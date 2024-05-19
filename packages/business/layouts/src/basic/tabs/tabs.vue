<script lang="ts" setup>
import { TabsView } from '@vben-core/tabs-ui';

import { useTabs } from './use-tabs';

defineOptions({
  name: 'LayoutTabs',
});

defineProps<{ showIcon?: boolean }>();

const {
  createContextMenus,
  currentActive,
  currentTabs,
  handleClick,
  handleClose,
  handleUnPushPin,
} = useTabs();
</script>

<template>
  <TabsView
    :show-icon="showIcon"
    :tabs="currentTabs"
    :menus="createContextMenus"
    :active="currentActive"
    @update:active="handleClick"
    @close="handleClose"
    @un-push-pin="handleUnPushPin"
  />
</template>
