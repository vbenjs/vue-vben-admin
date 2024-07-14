<script lang="ts" setup>
import { VbenScrollbar } from '@vben-core/shadcn-ui';
</script>

<template>
  <div class="bg-accent size-full">
    <VbenScrollbar>
      <slot></slot>
    </VbenScrollbar>
  </div>
</template>
