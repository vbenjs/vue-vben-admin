<script setup lang="ts">
import { VbenButton } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';

import IconSetting from './icons/setting.vue';

defineOptions({
  name: 'PreferenceTrigger',
});
</script>

<template>
  <VbenButton
    class="bg-primary flex-center h-9 w-9 cursor-pointer flex-col rounded-l-md rounded-r-none border-none"
    :title="$t('preference.preferences')"
  >
    <IconSetting class="text-lg" />
  </VbenButton>
</template>
