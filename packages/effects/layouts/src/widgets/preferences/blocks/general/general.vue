<script setup lang="ts">
import type { SelectOption } from '@vben/types';

import { $t } from '@vben/locales';
import { SUPPORT_LANGUAGES } from '@vben/preferences';

import SelectItem from '../select-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const appLocale = defineModel<string>('appLocale');
const appDynamicTitle = defineModel<boolean>('appDynamicTitle');

const localeItems: SelectOption[] = SUPPORT_LANGUAGES.map((item) => ({
  label: item.text,
  value: item.key,
}));
</script>

<template>
  <SelectItem v-model="appLocale" :items="localeItems">
    {{ $t('preferences.language') }}
  </SelectItem>
  <SwitchItem v-model="appDynamicTitle">
    {{ $t('preferences.dynamicTitle') }}
  </SwitchItem>
</template>
