<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/types';

import { IcBaselineLanguage } from '@vben-core/iconify';
import { loadLocaleMessages } from '@vben-core/locales';
import {
  SUPPORT_LANGUAGES,
  preferences,
  updatePreferences,
} from '@vben-core/preferences';
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
        <IcBaselineLanguage class="size-5" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
