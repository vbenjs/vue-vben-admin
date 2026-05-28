<script lang="ts" setup>
import { cn } from '@vben-core/shared/utils';

import { MoreHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <span
    data-slot="breadcrumb-ellipsis"
    :class="cn('flex size-9 items-center justify-center', props.class)"
    aria-hidden="true"
    role="presentation"
  >
    <slot>
      <MoreHorizontal class="size-4" />
    </slot>
    <span class="sr-only">More</span>
  </span>
</template>
