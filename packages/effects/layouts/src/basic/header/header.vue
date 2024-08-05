<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { VbenFullScreen } from '@vben-core/shadcn-ui';

import { GlobalSearch, LanguageToggle, ThemeToggle } from '../../widgets';

interface Props {
  /**
   * Logo 主题
   */
  theme?: string;
}

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const accessStore = useAccessStore();
const { globalSearchShortcutKey } = usePreferences();
const slots = useSlots();
const headerSlots = computed(() => {
  const list = [{ index: 20, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: 10,
      name: 'notification',
    });
  }
  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-')) {
      list.push({ index: Number(name[1]), name: key });
    }
  });
  return list.sort((a, b) => a.index - b.index);
});
</script>

<template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-1 items-center">
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-shrink-0 items-center">
    <GlobalSearch
      v-if="preferences.widget.globalSearch"
      :enable-shortcut-key="globalSearchShortcutKey"
      :menus="accessStore.accessMenus"
      class="mr-4"
    />
    <ThemeToggle v-if="preferences.widget.themeToggle" class="mr-2" />
    <LanguageToggle v-if="preferences.widget.languageToggle" class="mr-2" />
    <VbenFullScreen v-if="preferences.widget.fullscreen" class="mr-2" />
    <!--    <slot v-if="preferences.widget.notification" name="notification"></slot>-->
    <!--    <slot name="user-dropdown"></slot>-->
    <slot v-for="slot in headerSlots" :name="slot.name"></slot>
  </div>
</template>
