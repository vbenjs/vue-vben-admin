<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';
import { VbenFullScreen } from '@vben-core/shadcn-ui';

import {
  GlobalSearch,
  LanguageToggle,
  PreferencesButton,
  ThemeToggle,
} from '../../widgets';

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

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

const accessStore = useAccessStore();
const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences();
const slots = useSlots();
const rightSlots = computed(() => {
  const list = [{ index: 100, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: 5,
      name: 'global-search',
    });
  }

  if (preferencesButtonPosition.value.header) {
    list.push({
      index: 10,
      name: 'preferences',
    });
  }
  if (preferences.widget.themeToggle) {
    list.push({
      index: 15,
      name: 'theme-toggle',
    });
  }
  if (preferences.widget.languageToggle) {
    list.push({
      index: 20,
      name: 'language-toggle',
    });
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: 25,
      name: 'fullscreen',
    });
  }
  if (preferences.widget.notification) {
    list.push({
      index: 30,
      name: 'notification',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.sort((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: any[] = [];

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.sort((a, b) => a.index - b.index);
});

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>

<template>
  <template
    v-for="slot in leftSlots.filter((item) => item.index < 5)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > 5)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div class="flex h-full min-w-0 flex-1 items-center">
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-shrink-0 items-center">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          />
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton
            class="mr-1"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          />
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="mr-1 mt-[2px]" />
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenFullScreen class="mr-1" />
        </template>
      </slot>
    </template>
  </div>
</template>
