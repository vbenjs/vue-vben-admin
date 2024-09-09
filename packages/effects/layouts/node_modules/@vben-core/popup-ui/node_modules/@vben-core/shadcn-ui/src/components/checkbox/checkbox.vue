<script setup lang="ts">
import type { CheckboxRootEmits, CheckboxRootProps } from 'radix-vue';

import { useForwardPropsEmits } from 'radix-vue';

import { Checkbox } from '../ui/checkbox';

const props = defineProps<
  {
    name: string;
  } & CheckboxRootProps
>();

const emits = defineEmits<CheckboxRootEmits>();

const checked = defineModel<boolean>('checked');

const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <Checkbox v-bind="forwarded" :id="name" v-model:checked="checked" />
  <label :for="name" class="ml-2 cursor-pointer text-sm"> <slot></slot> </label>
</template>
