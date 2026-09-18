<script setup lang="ts">
import { computed } from 'vue';

import { $t } from '@vben/locales';

import InputItem from '../input-item.vue';
import SwitchItem from '../switch-item.vue';

const props = defineProps<{ disabled: boolean }>();

const copyrightEnable = defineModel<boolean>('copyrightEnable');
const copyrightDate = defineModel<string | undefined>('copyrightDate', {
  default: undefined,
});
const copyrightIcp = defineModel<string | undefined>('copyrightIcp', {
  default: undefined,
});
const copyrightIcpLink = defineModel<string | undefined>('copyrightIcpLink', {
  default: undefined,
});
const copyrightCompanyName = defineModel<string | undefined>(
  'copyrightCompanyName',
  {
    default: undefined,
  },
);
const copyrightCompanySiteLink = defineModel<string | undefined>(
  'copyrightCompanySiteLink',
  { default: undefined },
);

const itemDisabled = computed(() => props.disabled || !copyrightEnable.value);
</script>

<template>
  <SwitchItem v-model="copyrightEnable" :disabled="disabled">
    {{ $t('preferences.copyright.enable') }}
  </SwitchItem>

  <InputItem v-model="copyrightCompanyName" :disabled="itemDisabled">
    {{ $t('preferences.copyright.companyName') }}
  </InputItem>
  <InputItem v-model="copyrightCompanySiteLink" :disabled="itemDisabled">
    {{ $t('preferences.copyright.companySiteLink') }}
  </InputItem>
  <InputItem v-model="copyrightDate" :disabled="itemDisabled">
    {{ $t('preferences.copyright.date') }}
  </InputItem>

  <InputItem v-model="copyrightIcp" :disabled="itemDisabled">
    {{ $t('preferences.copyright.icp') }}
  </InputItem>
  <InputItem v-model="copyrightIcpLink" :disabled="itemDisabled">
    {{ $t('preferences.copyright.icpLink') }}
  </InputItem>
</template>
