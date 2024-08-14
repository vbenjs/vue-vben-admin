<script lang="ts" setup>
import { Settings } from '@vben/icons';
import { VbenIconButton } from '@vben-core/shadcn-ui';

import Preferences from './preferences.vue';
</script>
<template>
  <Preferences>
    <VbenIconButton>
      <Settings class="size-4" />
    </VbenIconButton>
  </Preferences>
</template>
