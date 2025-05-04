<script lang="ts" setup>
import { VbenIconButton } from '@vben/common-ui';

import { Support } from '#/icons';

const handleClick = () => {
  window.Tawk_API.minimize();
  window.Tawk_API.toggleVisibility();
};
</script>
<template>
  <VbenIconButton
    class="bell-button text-foreground relative"
    @click="handleClick"
  >
    <Support class="size-5" />
  </VbenIconButton>
</template>

<style scoped></style>
