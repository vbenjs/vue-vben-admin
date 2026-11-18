<script setup lang="ts">
import type { LanguageOption } from '@vben/constants';

import { onUnmounted, ref } from 'vue';

import { onSupportLanguagesChange } from '@vben/constants';
import { Languages } from '@vben/icons';
import { preferences } from '@vben/preferences';

import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

import { changeAppLocale } from './change-app-locale';

defineOptions({
  name: 'LanguageToggle',
});

const languageList = ref<LanguageOption[]>([]);
const unsubscribe = onSupportLanguagesChange((langs) => {
  languageList.value = [...langs];
});
onUnmounted(unsubscribe);
</script>

<template>
  <div>
    <VbenDropdownRadioMenu
      :menus="languageList"
      :model-value="preferences.app.locale"
      @reselect="changeAppLocale($event)"
      @update:model-value="changeAppLocale($event)"
    >
      <VbenIconButton class="hover:animate-[shrink_0.3s_ease-in-out]">
        <Languages class="size-4 text-foreground" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
