<script lang="ts" setup>
import { VbenLoading } from '@vben-core/shadcn-ui';

defineOptions({ name: 'Loading' });
defineProps<{
  spinning: boolean;
  text?: string;
}>();
</script>
<template>
  <div class="relative min-h-20">
    <slot></slot>
    <VbenLoading :spinning="spinning" :text="text">
      <template v-if="$slots.icon" #icon>
        <slot name="icon"></slot>
      </template>
    </VbenLoading>
  </div>
</template>
