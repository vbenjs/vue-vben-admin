<script setup lang="ts">
import { $t } from '@vben/locales';
import { VbenButton } from '@vben-core/shadcn-ui';

import IconSetting from './icons/setting.vue';

defineOptions({
  name: 'PreferenceTrigger',
});
</script>

<template>
  <VbenButton
    :title="$t('preference.preferences')"
    class="bg-primary flex-col-center h-9 w-9 cursor-pointer rounded-l-md rounded-r-none border-none"
  >
    <IconSetting class="text-lg" />
  </VbenButton>
</template>
