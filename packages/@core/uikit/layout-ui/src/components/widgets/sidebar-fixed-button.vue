<script setup lang="ts">
import { MdiPin, MdiPinOff } from '@vben-core/iconify';

interface Props {
  theme: string;
}

withDefaults(defineProps<Props>(), {});

const expandOnHover = defineModel<boolean>('expandOnHover');

function toggleFixed() {
  expandOnHover.value = !expandOnHover.value;
}
</script>

<template>
  <div
    :data-theme="theme"
    class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 right-3 z-10 cursor-pointer rounded-sm p-1 transition-all duration-300 data-[theme=dark]:bg-[hsl(var(--color-dark-accent))] data-[theme=dark]:text-[hsl(var(--color-dark-foreground)/60%)] data-[theme=dark]:hover:bg-[hsl(var(--color-dark-accent-hover))] data-[theme=dark]:hover:text-[hsl(var(--color-dark-foreground))]"
    @click="toggleFixed"
  >
    <MdiPinOff v-if="!expandOnHover" />
    <MdiPin v-else />
  </div>
</template>
