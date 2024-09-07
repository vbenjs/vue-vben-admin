<script lang="ts" setup>
import { cn } from '@vben-core/shared/utils';

import { ChevronRightIcon } from '@radix-icons/vue';

const props = defineProps<{
  class?: any;
}>();
</script>

<template>
  <li
    :class="cn('[&>svg]:size-3.5', props.class)"
    aria-hidden="true"
    role="presentation"
  >
    <slot>
      <ChevronRightIcon />
    </slot>
  </li>
</template>
