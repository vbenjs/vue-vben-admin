<script setup lang="ts">
import { cn } from '@vben-core/shared/utils';

import { AvatarRoot } from 'radix-vue';

import { avatarVariant, type AvatarVariants } from './avatar';

const props = withDefaults(
  defineProps<{
    class?: any;
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
