<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { SquareArrowDownLeft, SquareArrowUpRight } from '@vben/icons';

import { VbenIconButton } from '@vben-core/shadcn-ui';

const isMaximized = ref(false);

if (window.ipcRenderer) {
  onMounted(async () => {
    isMaximized.value = await window.ipcRenderer.invoke('is-maximized');
    window.ipcRenderer.on('maximize-changed', (_, maximized) => {
      isMaximized.value = maximized;
    });
  });
}

function handleAppMaximize() {
  window.ipcRenderer?.invoke('app-maximize');
}
</script>
<template>
  <div class="flex-center mr-2 h-full" @click.stop="handleAppMaximize()">
    <VbenIconButton class="bell-button text-foreground relative">
      <SquareArrowDownLeft v-if="isMaximized" class="size-4" />
      <SquareArrowUpRight v-else class="size-4" />
    </VbenIconButton>
  </div>
</template>
