<script setup lang="ts">
import { MdiMenuClose, MdiMenuOpen } from '@vben-core/iconify';
import { useNamespace } from '@vben-core/toolkit';

interface Props {
  theme: string;
}

defineOptions({ name: 'SideCollapseButton' });

withDefaults(defineProps<Props>(), {});

const collapse = defineModel<boolean>('collapse');

const { b, is } = useNamespace('side-collapse');

function handleCollapse() {
  collapse.value = !collapse.value;
}
</script>

<template>
  <div :class="[b(), is(theme, true)]" @click.stop="handleCollapse">
    <MdiMenuClose v-if="collapse" />
    <MdiMenuOpen v-else />
  </div>
</template>

<style scoped lang="scss">
@import '@vben-core/design/global';

@include b('side-collapse') {
  position: absolute;
  bottom: 6px;
  left: 10px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  color: hsl(var(--color-foreground) / 60%);
  cursor: pointer;
  background: hsl(var(--color-accent)) !important;
  border-radius: 4px;
  opacity: 1;
  transition: all 0.3s ease;

  @include is('dark') {
    color: hsl(var(--color-dark-foreground) / 60%) !important;
    background: hsl(var(--color-dark-accent)) !important;

    &:hover {
      color: hsl(var(--color-dark-foreground)) !important;
      background: hsl(var(--color-dark-accent-hover)) !important;
    }
  }

  &:hover {
    color: hsl(var(--color-foreground));
    background: hsl(var(--color-accent-hover));
  }
}
</style>
