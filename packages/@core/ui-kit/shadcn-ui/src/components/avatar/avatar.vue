<script setup lang="ts">
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
} from 'radix-vue';

import { computed } from 'vue';

import { Avatar, AvatarFallback, AvatarImage } from '../../ui';

interface Props extends AvatarRootProps, AvatarFallbackProps, AvatarImageProps {
  alt?: string;
  class?: any;
  dot?: boolean;
  dotClass?: any;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  alt: 'avatar',
  as: 'button',
  dot: false,
  dotClass: 'bg-green-500',
});

const text = computed(() => {
  return props.alt.slice(-2).toUpperCase();
});
</script>

<template>
  <div :class="props.class" class="relative flex flex-shrink-0 items-center">
    <Avatar :class="props.class" class="size-full">
      <AvatarImage :alt="alt" :src="src" />
      <AvatarFallback>{{ text }}</AvatarFallback>
    </Avatar>
    <span
      v-if="dot"
      :class="dotClass"
      class="border-background absolute bottom-0 right-0 size-3 rounded-full border-2"
    >
    </span>
  </div>
</template>
