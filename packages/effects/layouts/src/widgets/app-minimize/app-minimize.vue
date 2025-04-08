<script lang="ts" setup>
import { Minus } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

function handleAppMinimize() {
  window.ipcRenderer?.invoke('app-minimize');
}
</script>
<template>
  <div class="flex-center mr-2 h-full" @click.stop="handleAppMinimize()">
    <VbenIconButton class="bell-button text-foreground relative">
      <Minus class="size-4" />
    </VbenIconButton>
  </div>
</template>
