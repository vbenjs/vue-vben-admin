<script lang="ts" setup>
import { IcRoundFullscreen, IcRoundFullscreenExit } from '@vben-core/icons';

import { useFullscreen } from '@vueuse/core';

import { VbenIconButton } from '../button';

defineOptions({ name: 'FullScreen' });

const { isFullscreen, toggle } = useFullscreen();

// 重新检查全屏状态
isFullscreen.value = !!(
  document.fullscreenElement ||
  // @ts-ignore
  document.webkitFullscreenElement ||
  // @ts-ignore
  document.mozFullScreenElement ||
  // @ts-ignore
  document.msFullscreenElement
);
</script>
<template>
  <VbenIconButton @click="toggle">
    <IcRoundFullscreenExit v-if="isFullscreen" class="size-6" />
    <IcRoundFullscreen v-else class="size-6" />
  </VbenIconButton>
</template>
