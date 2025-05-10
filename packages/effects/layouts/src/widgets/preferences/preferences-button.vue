<script lang="ts" setup>
import { Settings } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

import Preferences from './preferences.vue';

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}
</script>
<template>
  <Preferences @clear-preferences-and-logout="clearPreferencesAndLogout">
    <VbenIconButton class="setting-button">
      <Settings class="text-foreground size-4" />
    </VbenIconButton>
  </Preferences>
</template>

<style scoped>
:deep(.setting-button) {
  &:hover {
    svg {
      animation: setting-rotate 0.6s;
    }
  }
}

@keyframes setting-rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(180deg);
  }
}
</style>
