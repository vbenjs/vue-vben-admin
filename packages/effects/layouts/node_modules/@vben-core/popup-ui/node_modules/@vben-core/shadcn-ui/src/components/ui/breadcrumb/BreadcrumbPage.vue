<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <span
    :class="cn('text-foreground font-normal', props.class)"
    aria-current="page"
    aria-disabled="true"
    role="link"
  >
    <slot></slot>
  </span>
</template>
