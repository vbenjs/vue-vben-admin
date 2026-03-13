<script setup lang="ts">
interface Props {
  title?: string;
}

defineOptions({
  name: 'PreferenceBlock',
});

withDefaults(defineProps<Props>(), {
  title: '',
});
</script>

<template>
  <div class="flex flex-col py-4">
    <h3 class="mb-3 leading-none font-semibold tracking-tight">
      {{ title }}
    </h3>
    <slot></slot>
  </div>
</template>
