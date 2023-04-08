<template>
  <span :class="$attrs.class">
    <VbenIcon :icon="icon" />
  </span>
</template>
<script lang="ts" setup>
  import { VbenIcon } from '@vben/icons';

  defineProps({
    icon: {
      type: String,
      default: '',
    },
  });
</script>
