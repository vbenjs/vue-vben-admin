<script lang="ts" setup>
import { usePreferences } from '@vben-core/preferences';
import { VbenFullScreen } from '@vben-core/shadcn-ui';
import { useCoreAccessStore } from '@vben-core/stores';

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

const accessStore = useCoreAccessStore();
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
      :enable-shortcut-key="globalSearchShortcutKey"
      :menus="accessStore.accessMenus"
      class="mr-4"
    />
    <ThemeToggle class="mr-2" />
    <LanguageToggle class="mr-2" />
    <VbenFullScreen class="mr-2" />
    <slot name="notification"></slot>
    <slot name="user-dropdown"></slot>
  </div>
</template>
