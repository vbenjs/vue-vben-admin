<template>
  <div class="p-4">
    <GrowCard class="mb-4" type="出库" />
    <DayOut class="w-full mb-4" height="260px" />
    <MonthOut class="w-full" height="260px" />
  </div>
</template>
<script lang="ts" setup name="HomeIndex">
  import GrowCard from './components/GrowCard.vue';
  import DayOut from './components/DayOut.vue';
  import MonthOut from './components/MonthOut.vue';
  import { onMountedOrActivated } from '@vben/hooks';

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));
  });
</script>
