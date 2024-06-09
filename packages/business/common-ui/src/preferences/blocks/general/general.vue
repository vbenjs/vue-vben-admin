<script setup lang="ts">
import type { SelectListItem } from '@vben/types';

import { $t } from '@vben/locales';
import { SUPPORT_LANGUAGES } from '@vben-core/preferences';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const appLocale = defineModel<string>('appLocale');
const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const shortcutKeysEnable = defineModel<boolean>('shortcutKeysEnable');

const localeItems: SelectListItem[] = SUPPORT_LANGUAGES.map((item) => ({
  label: item.text,
  value: item.key,
}));
</script>

<template>
  <SelectItem v-model="appLocale" :items="localeItems">
    {{ $t('preference.language') }}
  </SelectItem>
  <SwitchItem v-model="appDynamicTitle">
    {{ $t('preference.dynamic-title') }}
  </SwitchItem>
  <SwitchItem v-model="shortcutKeysEnable">
    {{ $t('preference.shortcut-key') }}
  </SwitchItem>
</template>
