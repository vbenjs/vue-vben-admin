<script setup lang="ts">
import type { PaginationEllipsisProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { MoreHorizontal } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationEllipsis } from 'reka-ui';

const props = defineProps<
  PaginationEllipsisProps & { class?: HTMLAttributes['class'] }
>();

const delegatedProps = reactiveOmit(props, 'class');
</script>

<template>
  <PaginationEllipsis
    data-slot="pagination-ellipsis"
    v-bind="delegatedProps"
    :class="cn('flex size-8 items-center justify-center', props.class)"
  >
    <slot>
      <MoreHorizontal class="size-4" />
    </slot>
  </PaginationEllipsis>
</template>
