<script setup lang="ts">
import type { InputProps } from './interface';

import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<InputProps>();

const modelValue = defineModel<number | string>();

const inputClass = computed(() => {
  if (props.status === 'error') {
    return 'border-destructive';
  }
  return '';
});
</script>

<template>
  <div class="relative mb-6">
    <label
      v-if="!label"
      :for="name"
      class="mb-2 block text-sm font-medium dark:text-white"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      v-model="modelValue"
      :class="[props.class, inputClass]"
      autocomplete="off"
      class="border-input bg-input-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring focus:border-primary flex h-10 w-full rounded-md border p-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      required
      type="text"
      v-bind="$attrs"
    />

    <slot></slot>

    <Transition name="slide-up">
      <p
        v-if="status === 'error'"
        class="text-destructive bottom-130 absolute mt-1 text-xs"
      >
        {{ errorTip }}
      </p>
    </Transition>
  </div>
</template>
