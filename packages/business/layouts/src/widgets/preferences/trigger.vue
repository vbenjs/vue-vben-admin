<script setup lang="ts">
import { $t } from '@vben-core/locales';
import { VbenButton } from '@vben-core/shadcn-ui';

import IconSetting from './icons/setting.vue';

defineOptions({
  name: 'PreferenceTrigger',
});
</script>

<template>
  <VbenButton
    :title="$t('preferences.title')"
    class="bg-primary flex-col-center h-12 w-12 cursor-pointer rounded-l-lg rounded-r-none border-none"
  >
    <IconSetting
      class="duration-3000 fill-primary-foreground animate-spin text-2xl"
    />
  </VbenButton>
</template>
