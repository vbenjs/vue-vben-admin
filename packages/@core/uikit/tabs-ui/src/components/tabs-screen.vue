<script lang="ts" setup>
import { IcRoundFitScreen, IcTwotoneFitScreen } from '@vben-core/iconify';

const screen = defineModel<boolean>('screen');

function toggleScreen() {
  screen.value = !screen.value;
}
</script>

<template>
  <div
    class="flex-center hover:bg-accent hover:text-foreground text-muted-foreground h-full cursor-pointer border-l px-2 text-lg font-semibold"
    @click="toggleScreen"
  >
    <IcTwotoneFitScreen v-if="screen" />
    <IcRoundFitScreen v-else />
  </div>
</template>
