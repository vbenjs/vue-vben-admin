<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const modelValue = defineModel<number | string>();
</script>

<template>
  <input
    v-model="modelValue"
    autocomplete="off"
    class="border-input bg-input-background ring-offset-background placeholder:text-muted-foreground/60 focus-visible:ring-ring focus:border-primary flex h-10 w-full rounded-md border p-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    required
    type="text"
    v-bind="$attrs"
  />
</template>
