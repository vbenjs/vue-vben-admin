<script setup lang="ts">
import type { Props } from './page.ts';

import PageFooter from './page-footer.vue';
import PageHeader from './page-header.vue';

defineOptions({
  name: 'Page',
});

const props = withDefaults(defineProps<Props>(), {
  headerSticky: false,
  showFooter: false,
  showHeader: true,
  title: '',
});
</script>

<template>
  <div class="relative h-full">
    <PageHeader v-if="props.showHeader" :title="props.title">
      <template #default>
        <slot name="headerContent"></slot>
      </template>
    </PageHeader>
    <div class="m-4 overflow-hidden">
      <slot></slot>
    </div>
    <PageFooter v-if="props.showFooter">
      <template #default>
        <slot name="footerContent"></slot>
      </template>
    </PageFooter>
  </div>
</template>
