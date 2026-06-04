<script setup lang="ts">
import type { SelectGroupProps } from 'reka-ui';

import { SelectGroup } from 'reka-ui';

const props = defineProps<SelectGroupProps>();
</script>

<template>
  <SelectGroup data-slot="select-group" v-bind="props">
    <slot></slot>
  </SelectGroup>
</template>
