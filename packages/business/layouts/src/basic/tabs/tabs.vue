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
    :active="currentActive"
    :menus="createContextMenus"
    :show-icon="showIcon"
    :tabs="currentTabs"
    @close="handleClose"
    @un-push-pin="handleUnPushPin"
    @update:active="handleClick"
  />
</template>
