<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';

import { Dot } from 'lucide-vue-next';
import { Primitive, useForwardProps } from 'reka-ui';

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive v-bind="forwardedProps" data-slot="pin-input-separator">
    <slot>
      <Dot class="size-4" />
    </slot>
  </Primitive>
</template>
