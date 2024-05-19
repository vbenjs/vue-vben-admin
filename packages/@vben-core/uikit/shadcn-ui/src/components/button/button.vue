<script setup lang="ts">
import { MdiLoading } from '@vben-core/iconify';

import type { HTMLAttributes } from 'vue';

import { type ButtonVariants, buttonVariants } from '#/components/ui/button';
import { cn } from '#/lib/utils';
import { Primitive, type PrimitiveProps } from 'radix-vue';
import { computed } from 'vue';

interface Props extends PrimitiveProps {
  class?: HTMLAttributes['class'];
  disabled?: boolean;
  loading?: boolean;
  size?: ButtonVariants['size'];
  variant?: ButtonVariants['variant'];
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  class: '',
  disabled: false,
  loading: false,
  size: 'default',
  variant: 'default',
});

const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    :disabled="isDisabled"
  >
    <MdiLoading
      v-if="loading"
      class="text-md mr-2 flex-shrink-0 animate-spin"
    />
    <slot></slot>
  </Primitive>
</template>
