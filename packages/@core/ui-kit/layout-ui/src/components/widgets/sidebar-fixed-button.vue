<script setup lang="ts">
import { MdiPin, MdiPinOff } from '@vben-core/icons';

interface Props {
  theme: string;
}

defineProps<Props>();

const expandOnHover = defineModel<boolean>('expandOnHover');

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value;
}
</script>

<template>
  <div
    :data-theme="theme"
    class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent data-[theme=dark]:hover:bg-accent-dark-hover data-[theme=dark]:bg-accent-dark data-[theme=dark]:text-foreground-dark/60 data-[theme=dark]:hover:text-foreground-dark absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-1 transition-all duration-300"
    @click="toggleFixed"
  >
    <MdiPinOff v-if="!expandOnHover" />
    <MdiPin v-else />
  </div>
</template>
