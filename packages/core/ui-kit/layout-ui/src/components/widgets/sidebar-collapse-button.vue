<script setup lang="ts">
import { MdiMenuClose, MdiMenuOpen } from '@vben-core/icons';

const collapsed = defineModel<boolean>('collapsed');

function handleCollapsed() {
  collapsed.value = !collapsed.value;
}
</script>

<template>
  <div
    class="flex-center hover:text-foreground text-foreground/60 hover:bg-accent-hover bg-accent absolute bottom-2 left-3 z-10 cursor-pointer rounded-sm p-1 transition-all duration-300"
    @click.stop="handleCollapsed"
  >
    <MdiMenuClose v-if="collapsed" class="size-4" />
    <MdiMenuOpen v-else class="size-4" />
  </div>
</template>
