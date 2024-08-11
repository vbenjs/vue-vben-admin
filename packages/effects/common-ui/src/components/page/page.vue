<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  contentClass?: string;
  showFooter?: boolean;
}

defineOptions({
  name: 'Page',
});

const props = withDefaults(defineProps<Props>(), {
  contentClass: '',
  description: '',
  showFooter: false,
  title: '',
});
</script>

<template>
  <div class="relative h-full">
    <div
      v-if="description || $slots.description || title"
      class="bg-card px-6 py-4"
    >
      <div class="mb-2 flex justify-between text-xl font-bold leading-10">
        {{ title }}
      </div>
      <template v-if="description">{{ description }}</template>
      <slot v-else name="description"></slot>
    </div>

    <div :class="contentClass" class="m-4">
      <slot></slot>
    </div>

    <div
      v-if="props.showFooter"
      class="bg-card align-center absolute bottom-0 left-0 right-0 flex px-6 py-4"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>
