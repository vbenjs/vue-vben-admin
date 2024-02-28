<template>
  <div class="p-4">
    <GrowCard class="mb-4" />
    <div class="lg:flex w-full mb-4">
      <DayIn class="lg:w-1/2 !lg:mr-4" height="260px" :data="dayData?.pieceIn" />
      <DayOut class="lg:w-1/2 mt-4 !lg:mt-0" height="260px" :data="dayData?.pieceOut" />
    </div>
    <div class="lg:flex w-full">
      <MonthIn class="lg:w-1/2 !lg:mr-4" height="260px" :data="MonthData?.pieceIn" />
      <MonthOut class="lg:w-1/2 mt-4 !lg:mt-0" height="260px" :data="MonthData?.pieceOut" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import GrowCard from './components/GrowCard.vue';
  import DayIn from './components/DayIn.vue';
  import MonthIn from './components/MonthIn.vue';
  import DayOut from './components/DayOut.vue';
  import MonthOut from './components/MonthOut.vue';
  import { onMountedOrActivated } from '@vben/hooks';
  import { getDaySummary, getMonthSummary } from '@/api/home';
  import { ref } from 'vue';

  defineOptions({ name: 'HomeIndex' });

  const dayData = ref();
  const MonthData = ref();

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));

    const day = await getDaySummary();
    const month = await getMonthSummary();

    dayData.value = day;
    MonthData.value = month;
  });
</script>
