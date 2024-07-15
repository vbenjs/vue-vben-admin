<script setup lang="ts">
import { MdiMenuClose, MdiMenuOpen } from '@vben-core/icons';

interface Props {
  theme: string;
}

defineProps<Props>();

const collapsed = defineModel<boolean>('collapsed');

function handleCollapsed() {
  collapsed.value = !collapsed.value;
}
</script>

<template>
  <div
    :data-theme="theme"
    class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent data-[theme=dark]:hover:bg-accent-dark-hover data-[theme=dark]:bg-accent-dark data-[theme=dark]:text-foreground-dark/60 data-[theme=dark]:hover:text-foreground-dark absolute bottom-2 left-3 z-10 cursor-pointer rounded-sm p-1 transition-all duration-300"
    @click.stop="handleCollapsed"
  >
    <MdiMenuClose v-if="collapsed" />
    <MdiMenuOpen v-else />
  </div>
</template>
