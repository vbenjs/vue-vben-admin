<script setup lang="ts">
import type { Props } from './page.ts';

import PageFooter from './page-footer.vue';
import PageHeader from './page-header.vue';

defineOptions({
  name: 'Page',
});

const props = withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div>
    <PageHeader />
    <slot>{{ props.title }}</slot>
    <PageFooter />
  </div>
</template>
