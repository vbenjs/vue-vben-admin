<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

import { type BadgeVariants, badgeVariants } from './badge';

const props = defineProps<{
  class?: any;
  variant?: BadgeVariants['variant'];
}>();
</script>

<template>
  <div :class="cn(badgeVariants({ variant }), props.class)">
    <slot></slot>
  </div>
</template>
