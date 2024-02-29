<template>
  <div class="p-4">
    <GrowCard class="mb-4" />
    <div class="lg:flex w-full mb-4">
      <DayRemind class="enter-x lg:w-1/2 !lg:mr-4" height="260px" />
      <ServiceType class="enter-x lg:w-1/2 mt-4 !lg:mt-0" height="260px" />
    </div>
    <div class="lg:flex w-full">
      <MonthRemind class="enter-x lg:w-1/2 !lg:mr-4" height="260px" />
      <div class="lg:flex lg:w-1/2">
        <Satisfaction class="enter-x lg:w-1/2 mt-4 !lg:mt-0 !lg:mr-4" height="260px" />
        <Top5
          class="enter-x lg:w-1/2"
          height="260px"
          title="设备告警次数统计"
          :data="equipmentRemind"
          :number="7"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="HomeIndex">
  import GrowCard from './components/GrowCard.vue';
  import DayRemind from './components/DayRemind.vue';
  import MonthRemind from './components/MonthRemind.vue';
  import ServiceType from './components/ServiceType.vue';
  import Satisfaction from './components/Satisfaction.vue';
  import Top5 from './components/Top5.vue';
  import { ref } from 'vue';
  import { getHomeEquipmentRemind } from '@/api/home';
  import { onMountedOrActivated } from '@vben/hooks';

  const equipmentRemind = ref();
  onMountedOrActivated(async () => {
    const data = await getHomeEquipmentRemind();
    equipmentRemind.value = data;

    window.dispatchEvent(new Event('resize'));
  });
</script>
