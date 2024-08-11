<script setup lang="ts">
import type { Props } from './page';

import PageFooter from './page-footer.vue';
import PageHeader from './page-header.vue';

defineOptions({
  name: 'Page',
});

const props = withDefaults(defineProps<Props>(), {
  description: '',
  showFooter: false,
  title: '',
});
</script>

<template>
  <div class="relative h-full">
    <PageHeader
      v-if="description || $slots.description || title"
      :title="props.title"
    >
      <template #default>
        <template v-if="description">{{ description }}</template>
        <slot v-else name="description"></slot>
      </template>
    </PageHeader>
    <div :class="contentClass" class="m-4">
      <slot></slot>
    </div>
    <PageFooter v-if="props.showFooter">
      <template #default>
        <slot name="footer"></slot>
      </template>
    </PageFooter>
  </div>
</template>
