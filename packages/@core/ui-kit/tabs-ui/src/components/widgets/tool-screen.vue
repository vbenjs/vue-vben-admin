<script lang="ts" setup>
import { IcRoundFitScreen, IcTwotoneFitScreen } from '@vben-core/icons';

const screen = defineModel<boolean>('screen');

function toggleScreen() {
  screen.value = !screen.value;
}
</script>

<template>
  <div
    class="flex-center hover:bg-muted bg-accent hover:text-foreground text-muted-foreground border-border h-full cursor-pointer border-l px-2 text-lg font-semibold"
    @click="toggleScreen"
  >
    <IcTwotoneFitScreen v-if="screen" />
    <IcRoundFitScreen v-else />
  </div>
</template>
