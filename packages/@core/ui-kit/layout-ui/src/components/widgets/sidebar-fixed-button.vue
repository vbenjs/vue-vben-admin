<script setup lang="ts">
import { Pin, PinOff } from '@vben-core/icons';

const expandOnHover = defineModel<boolean>('expandOnHover');
const expandOnHovering = defineModel<boolean>('expandOnHovering');
const collapse = defineModel<boolean>('collapse');
const extraVisible = defineModel<boolean>('extraVisible');

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value;
  collapse.value = false;
  extraVisible.value = true;
  if (!expandOnHover.value) {
    expandOnHovering.value = true;
  }
}
</script>

<template>
  <div
    class="absolute right-3 bottom-2 z-10 flex-center cursor-pointer rounded-sm bg-accent p-1.25 text-foreground/60 transition-all duration-300 hover:bg-accent-hover hover:text-foreground"
    @click="toggleFixed"
  >
    <PinOff v-show="!expandOnHover" class="size-3.5" />
    <Pin v-show="expandOnHover" class="size-3.5" />
  </div>
</template>
