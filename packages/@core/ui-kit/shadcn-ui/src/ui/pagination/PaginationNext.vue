<script setup lang="ts">
import type { PaginationNextProps } from 'reka-ui';

import type { HTMLAttributes } from 'vue';

import type { ButtonVariants } from '../button';

import { cn } from '@vben-core/shared/utils';

import { ChevronRightIcon } from '@lucide/vue';
import { reactiveOmit } from '@vueuse/core';
import { PaginationNext, useForwardProps } from 'reka-ui';

import { Button, buttonVariants } from '../button';

const props = withDefaults(
  defineProps<
    PaginationNextProps & {
      class?: HTMLAttributes['class'];
      size?: ButtonVariants['size'];
    }
  >(),
  {
    size: 'default',
  },
);

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationNext
    data-slot="pagination-next"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size }),
        'gap-1 px-2.5 sm:pr-2.5',
        props.class,
      )
    "
    v-bind="forwarded"
  >
    <Button :class="cn('size-8 p-0', props.class)" variant="outline">
      <slot>
        <ChevronRightIcon class="size-4" />
      </slot>
    </Button>
  </PaginationNext>
</template>
