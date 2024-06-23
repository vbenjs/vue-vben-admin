<script setup lang="ts">
import type { Component } from 'vue';

defineOptions({
  name: 'RenderContent',
});

const props = withDefaults(
  defineProps<{ content: Component | string; props?: Record<string, any> }>(),
  {
    props: () => ({}),
  },
);

const isComponent = typeof props.content === 'object' && props.content !== null;
</script>

<template>
  <component :is="content" v-bind="props" v-if="isComponent" />
  <template v-else-if="!isComponent">
    {{ content }}
  </template>
</template>
