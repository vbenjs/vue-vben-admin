<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui';

import { Minus } from '@lucide/vue';
import { Primitive, useForwardProps } from 'reka-ui';

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive data-slot="pin-input-separator" v-bind="forwardedProps">
    <slot>
      <Minus />
    </slot>
  </Primitive>
</template>
