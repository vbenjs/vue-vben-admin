<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { cn } from '#/lib/utils';
import { AvatarRoot } from 'radix-vue';

import { type AvatarVariants, avatarVariant } from './avatar';

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class'];
    shape?: AvatarVariants['shape'];
    size?: AvatarVariants['size'];
  }>(),
  {
    shape: 'circle',
    size: 'sm',
  },
);
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape }), props.class)">
    <slot></slot>
  </AvatarRoot>
</template>
