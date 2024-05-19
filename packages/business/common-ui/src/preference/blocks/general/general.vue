<script setup lang="ts">
import type { SelectListItem } from '@vben-core/typings';

import { $t } from '@vben/locales';
import { staticPreference } from '@vben/preference';

import SelectItem from '../select-item.vue';

defineOptions({
  name: 'PreferenceGeneralConfig',
});

const locale = defineModel<string>('locale');

const localeItems: SelectListItem[] = staticPreference.supportLanguages.map(
  (item) => ({
    label: item.text,
    value: item.key,
  }),
);
</script>

<template>
  <SelectItem v-model="locale" :items="localeItems">
    {{ $t('preference.language') }}
  </SelectItem>
</template>
