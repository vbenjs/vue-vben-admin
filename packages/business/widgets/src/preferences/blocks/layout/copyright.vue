<script setup lang="ts">
import { $t } from '@vben-core/locales';

import InputItem from '../input-item.vue';
import SwitchItem from '../switch-item.vue';

defineOptions({
  name: 'PreferenceBreadcrumbConfig',
});

const copyrightEnable = defineModel<boolean>('copyrightEnable');
const copyrightDate = defineModel<string>('copyrightDate');
const copyrightIcp = defineModel<string>('copyrightIcp');
const copyrightIcpLink = defineModel<string>('copyrightIcpLink');
const copyrightCompanyName = defineModel<string>('copyrightCompanyName');
const copyrightCompanySiteLink = defineModel<string>(
  'copyrightCompanySiteLink',
);
</script>

<template>
  <SwitchItem v-model="copyrightEnable">
    {{ $t('preferences.copyright.enable') }}
  </SwitchItem>

  <InputItem v-model="copyrightCompanyName" :disabled="!copyrightEnable">
    {{ $t('preferences.copyright.company-name') }}
  </InputItem>
  <InputItem v-model="copyrightCompanySiteLink" :disabled="!copyrightEnable">
    {{ $t('preferences.copyright.company-site-link') }}
  </InputItem>
  <InputItem v-model="copyrightDate" :disabled="!copyrightEnable">
    {{ $t('preferences.copyright.date') }}
  </InputItem>

  <InputItem v-model="copyrightIcp" :disabled="!copyrightEnable">
    {{ $t('preferences.copyright.icp') }}
  </InputItem>
  <InputItem v-model="copyrightIcpLink" :disabled="!copyrightEnable">
    {{ $t('preferences.copyright.icp-link') }}
  </InputItem>
</template>
