<script setup lang="ts">
import { useScrollLock } from '@vben-core/composables';

useScrollLock();
</script>
<template>
  <div
    class="bg-overlay fixed inset-0 z-[1000]"
    data-dismissable-drawer="true"
  ></div>
</template>
