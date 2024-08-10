<script setup lang="ts">
import type { Props } from './page.ts';

import { computed, type CSSProperties } from 'vue';

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

const headerStyle = computed((): CSSProperties => {
  const { headerSticky } = props;
  if (!headerSticky) {
    return {};
  }

  return {
    position: 'sticky',
    top: 0,
    zIndex: 99,
  };
});
</script>

<template>
  <div class="relative h-full">
    <PageHeader
      v-if="props.showHeader"
      :style="headerStyle"
      :title="props.title"
    >
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
