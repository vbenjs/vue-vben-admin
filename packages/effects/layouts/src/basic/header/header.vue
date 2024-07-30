<script lang="ts" setup>
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
    <slot v-if="preferences.widget.notification" name="notification"></slot>
    <slot name="user-dropdown"></slot>
  </div>
</template>
