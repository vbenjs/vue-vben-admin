<script lang="ts" setup>
import { VbenSpinner } from '@vben-core/shadcn-ui';

defineOptions({ name: 'Spinner' });
defineProps({
  spinning: Boolean,
});
</script>
<template>
  <div class="relative min-h-20">
    <slot></slot>
    <VbenSpinner :spinning="spinning" />
  </div>
</template>
