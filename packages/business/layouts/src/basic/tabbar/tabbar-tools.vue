<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { preferences } from '@vben-core/preferences';
import { TabsToolMore, TabsToolScreen } from '@vben-core/tabs-ui';

import { updateContentScreen, useTabs } from './use-tabs';

const route = useRoute();

const { createContextMenus } = useTabs();

const menus = computed(() => {
  return createContextMenus(route);
});
</script>

<template>
  <div class="flex-center h-full">
    <TabsToolMore :menus="menus" />
    <TabsToolScreen
      :screen="preferences.sidebar.hidden"
      @change="updateContentScreen"
      @update:screen="updateContentScreen"
    />
  </div>
</template>
