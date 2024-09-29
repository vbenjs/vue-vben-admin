<script setup lang="ts">
import { inject } from 'vue';

import { useScrollLock } from '@vben-core/composables';

useScrollLock();
const id = inject('DISMISSABLE_MODAL_ID');
</script>
<template>
  <div
    :data-dismissable-modal="id"
    class="bg-overlay fixed inset-0 z-[1000]"
  ></div>
</template>
