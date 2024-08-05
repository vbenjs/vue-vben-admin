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
  const list = [{ index: 30, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: 5,
      name: 'global-search',
    });
  }
  if (preferences.widget.themeToggle) {
    list.push({
      index: 10,
      name: 'theme-toggle',
    });
  }
  if (preferences.widget.languageToggle) {
    list.push({
      index: 15,
      name: 'language-toggle',
    });
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: 20,
      name: 'fullscreen',
    });
  }
  if (preferences.widget.notification) {
    list.push({
      index: 25,
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
    <template v-for="slot in headerSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-4"
          />
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="mr-2" />
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="mr-2" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenFullScreen class="mr-2" />
        </template>
      </slot>
    </template>
  </div>
</template>
