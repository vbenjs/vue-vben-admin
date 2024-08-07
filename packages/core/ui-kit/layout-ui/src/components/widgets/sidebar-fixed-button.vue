<script setup lang="ts">
import { MdiPin, MdiPinOff } from '@vben-core/icons';

const expandOnHover = defineModel<boolean>('expandOnHover');

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value;
}
</script>

<template>
  <div
    class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-1 transition-all duration-300"
    @click="toggleFixed"
  >
    <MdiPinOff v-if="!expandOnHover" />
    <MdiPin v-else />
  </div>
</template>
