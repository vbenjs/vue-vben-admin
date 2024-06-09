<script lang="ts" setup>
import { GlobalSearch, LanguageToggle, ThemeToggle } from '@vben/common-ui';
import { preferences } from '@vben-core/preferences';
import { VbenFullScreen } from '@vben-core/shadcn-ui';
import { useAccessStore } from '@vben-core/stores';

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
      :enable-shortcut-key="preferences.shortcutKeys.enable"
      :menus="accessStore.getAccessMenus"
      class="mr-4"
    />
    <ThemeToggle class="mr-2" />
    <LanguageToggle class="mr-2" />
    <VbenFullScreen class="mr-2" />
    <slot name="notification"></slot>
    <slot name="user-dropdown"></slot>
  </div>
</template>
