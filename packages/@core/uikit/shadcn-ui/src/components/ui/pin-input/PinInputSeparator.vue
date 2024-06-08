<script setup lang="ts">
import { DashIcon } from '@radix-icons/vue';
import { Primitive, type PrimitiveProps, useForwardProps } from 'radix-vue';

const props = defineProps<PrimitiveProps>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <Primitive v-bind="forwardedProps">
    <slot>
      <DashIcon />
    </slot>
  </Primitive>
</template>
