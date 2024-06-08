<script setup lang="ts">
import { MdiPin, MdiPinOff } from '@vben-core/iconify';
import { useNamespace } from '@vben-core/toolkit';

interface Props {
  theme: string;
}

defineOptions({ name: 'SidePinButton' });

withDefaults(defineProps<Props>(), {});

const expandOnHover = defineModel<boolean>('expandOnHover');

const { b, is } = useNamespace('side-pin');

function togglePined() {
  expandOnHover.value = !expandOnHover.value;
}
</script>

<template>
  <div :class="[b(), is(theme, true)]" @click="togglePined">
    <MdiPinOff v-if="!expandOnHover" />
    <MdiPin v-else />
  </div>
</template>

<style scoped lang="scss">
@import '@vben-core/design/global';

@include b('side-pin') {
  position: absolute;
  right: 10px;
  bottom: 6px;
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
    background: unset;
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
