<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/types';

import { Languages } from '@vben/icons';
import { loadLocaleMessages } from '@vben/locales';
import {
  preferences,
  SUPPORT_LANGUAGES,
  updatePreferences,
} from '@vben/preferences';
import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'LanguageToggle',
});

const menus = SUPPORT_LANGUAGES;

async function handleUpdate(value: string) {
  const locale = value as SupportedLanguagesType;
  updatePreferences({
    app: {
      locale,
    },
  });
  // 更改预览
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <VbenDropdownRadioMenu
      :menus="menus"
      :model-value="preferences.app.locale"
      @update:model-value="handleUpdate"
    >
      <VbenIconButton>
        <Languages class="size-4" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
