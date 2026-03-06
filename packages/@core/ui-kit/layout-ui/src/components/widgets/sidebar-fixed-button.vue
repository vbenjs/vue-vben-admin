<script setup lang="ts">
import { Pin, PinOff } from '@vben-core/icons';

const expandOnHover = defineModel<boolean>('expandOnHover');

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value;
}
</script>

<template>
  <div
    class="flex-center bg-accent text-foreground/60 hover:bg-accent-hover hover:text-foreground absolute right-3 bottom-2 z-10 cursor-pointer rounded-sm p-[5px] transition-all duration-300"
    @click="toggleFixed"
  >
    <PinOff v-if="!expandOnHover" class="size-3.5" />
    <Pin v-else class="size-3.5" />
  </div>
</template>
