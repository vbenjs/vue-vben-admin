<script setup lang="ts">
import { useScrollLock } from '@vben-core/composables';

useScrollLock();
</script>
<template>
  <div
    class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-overlay fixed inset-0 z-[1000]"
    data-dismissable-modal="true"
  ></div>
</template>
