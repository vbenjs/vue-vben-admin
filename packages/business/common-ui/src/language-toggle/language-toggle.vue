<script setup lang="ts">
import type { SupportLocale } from '@vben-core/typings';

import { IcBaselineLanguage } from '@vben-core/iconify';
import { VbenDropdownRadioMenu, VbenIconButton } from '@vben-core/shadcn-ui';

import { loadLocaleMessages } from '@vben/locales';
import {
  preference,
  staticPreference,
  updatePreference,
} from '@vben/preference';

defineOptions({
  name: 'LanguageToggle',
});

const menus = staticPreference.supportLanguages;

async function handleUpdate(value: string) {
  const locale = value as SupportLocale;
  updatePreference({
    locale,
  });
  // 更改预览
  await loadLocaleMessages(locale);
}
</script>

<template>
  <div>
    <VbenDropdownRadioMenu
      :menus="menus"
      :model-value="preference.locale"
      @update:model-value="handleUpdate"
    >
      <VbenIconButton>
        <IcBaselineLanguage class="size-5" />
      </VbenIconButton>
    </VbenDropdownRadioMenu>
  </div>
</template>
