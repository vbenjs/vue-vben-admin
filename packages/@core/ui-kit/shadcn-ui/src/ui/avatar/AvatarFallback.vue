<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui';

import { AvatarFallback } from 'reka-ui';

const props = defineProps<AvatarFallbackProps>();
</script>

<template>
  <AvatarFallback
    v-bind="props"
    data-slot="avatar-fallback"
    class="bg-muted flex size-full items-center justify-center rounded-full"
  >
    <slot></slot>
  </AvatarFallback>
</template>
