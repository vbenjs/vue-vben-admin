<template>
  <div class="p-4">
    <GrowCard class="mb-4" />
    <DayIn class="w-full mb-4" height="260px" />
    <MonthIn class="w-full" height="260px" />
  </div>
</template>
<script lang="ts" setup name="HomeIndex">
  import GrowCard from './components/GrowCard.vue';
  import DayIn from './components/DayIn.vue';
  import MonthIn from './components/MonthIn.vue';

  import { onMountedOrActivated } from '@vben/hooks';

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));
  });
</script>
