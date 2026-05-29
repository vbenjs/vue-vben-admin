<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
</script>

<template>
  <div
    data-slot="sheet-footer"
    :class="cn('flex flex-row justify-end gap-x-2', props.class)"
  >
    <slot></slot>
  </div>
</template>
