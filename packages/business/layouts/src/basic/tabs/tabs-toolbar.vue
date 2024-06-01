<script lang="ts" setup>
import { TabsMore, TabsScreen } from '@vben-core/tabs-ui';

import { preference, updatePreference } from '@vben/preference';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useTabs } from './use-tabs';

const route = useRoute();

const { createContextMenus } = useTabs();

const menus = computed(() => {
  return createContextMenus(route);
});

function handleScreenChange(screen: boolean) {
  updatePreference({
    headerHidden: !!screen,
    sideHidden: !!screen,
  });
}
</script>

<template>
  <div class="flex-center h-full">
    <TabsMore :menus="menus" />
    <TabsScreen
      :screen="preference.sideHidden && preference.sideHidden"
      @change="handleScreenChange"
      @update:screen="handleScreenChange"
    />
  </div>
</template>
