<script lang="ts" setup>
import type { HTMLAttributes } from 'vue';

import { ChevronRightIcon } from '@radix-icons/vue';

import { cn } from '#/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
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
