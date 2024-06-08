<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { preferences, updatePreferences } from '@vben-core/preferences';
import { TabsMore, TabsScreen } from '@vben-core/tabs-ui';

import { useTabs } from './use-tabs';

const route = useRoute();

const { createContextMenus } = useTabs();

const menus = computed(() => {
  return createContextMenus(route);
});

function handleScreenChange(screen: boolean) {
  updatePreferences({
    header: {
      hidden: !!screen,
    },
    sidebar: {
      hidden: !!screen,
    },
  });
}
</script>

<template>
  <div class="flex-center h-full">
    <TabsMore :menus="menus" />
    <TabsScreen
      :screen="preferences.sidebar.hidden"
      @change="handleScreenChange"
      @update:screen="handleScreenChange"
    />
  </div>
</template>
