<script lang="ts" setup>
import { ref } from 'vue';

import { VbenIconButton } from '@vben/common-ui';

import { Support } from '#/icons';
import { crispDisplay } from '#/shared/crisp';

const display = ref(true);

const handleClick = () => {
  display.value = !display.value;

  crispDisplay(display.value);
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
