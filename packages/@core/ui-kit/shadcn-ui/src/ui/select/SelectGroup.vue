<script setup lang="ts">
import type { SelectGroupProps } from 'reka-ui';

import { computed } from 'vue';

import { cn } from '@vben-core/shared/utils';

import { SelectGroup } from 'reka-ui';

const props = defineProps<SelectGroupProps & { class?: any }>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <SelectGroup
    v-bind="delegatedProps"
    data-slot="select-group"
    :class="cn('w-full p-1', props.class)"
  >
    <slot></slot>
  </SelectGroup>
</template>
