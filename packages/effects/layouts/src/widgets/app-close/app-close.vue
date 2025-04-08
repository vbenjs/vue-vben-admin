<script lang="ts" setup>
import { X } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

function handleAppClose() {
  window.ipcRenderer?.invoke('app-close');
}
</script>
<template>
  <div class="flex-center mr-2 h-full" @click.stop="handleAppClose()">
    <VbenIconButton class="bell-button text-foreground relative">
      <X class="size-4" />
    </VbenIconButton>
  </div>
</template>
