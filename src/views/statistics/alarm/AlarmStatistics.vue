<template>
  <div class="p-4">
    <div class="mb-4 flex">
      <RangePicker v-model:value="range" :offset-days="60" />
      <span class="ml-4">
        <span> 地点：</span>
        <ApiSelect
          class="w-50"
          :api="getStore"
          :immediate="true"
          :filterOption="false"
          showSearch
          labelField="name"
          valueField="id"
          searchField="storeInfo"
          :formatter="formatter"
          autoSelectFirst
          v-model:value="storeId"
          @options-change="hanldeChangeOptions"
        />
      </span>
    </div>
    <div class="lg:flex w-full mb-4">
      <ServiceType
        class="enter-x lg:w-1/2 mt-4 !lg:mt-0 !lg:mr-4"
        :height="height"
        :data="report?.attribute"
      />
      <MonthRemind
        class="enter-x lg:w-1/2"
        :height="height"
        :data="report?.alarmStatis"
        :dateRange="range"
      />
    </div>
    <div class="lg:flex w-full">
      <Satisfaction
        class="enter-x lg:w-1/2 mt-4 !lg:mt-0 !lg:mr-4"
        :height="height"
        :data="report?.alarmLevel"
      />
      <Top5
        class="enter-x lg:w-1/2"
        :height="height"
        title="设备告警次数统计"
        :number="8"
        :data="report?.equipment"
      />
    </div>
  </div>
</template>
<script lang="ts" setup name="">
  import { ref, watch } from 'vue';
  import { getStore } from '@/api/store';
  import { useFormat } from '@/utils/format';
  import { ApiSelect } from '@/components/Form';
  import { onMountedOrActivated } from '@vben/hooks';
  import MonthRemind from './components/MonthRemind.vue';
  import ServiceType from './components/ServiceType.vue';
  import Satisfaction from './components/Satisfaction.vue';
  import Top5 from './components/Top5.vue';
  import { getAlarmReport } from '@/api/report';
  import { getMonthRange } from '@/utils/dateUtil';
  import { RangePicker } from '@/components/Business';

  const { formatStore } = useFormat();
  const formatter = (item: any) => formatStore(item, '()');
  const month = getMonthRange().join(' - ');

  const height = ref('280px');
  const range = ref(month);
  const storeId = ref<number>();
  const report = ref();

  const hanldeChangeOptions = (array: any[]) => {
    if (!storeId.value) storeId.value = array[0].id;
  };

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));
  });

  watch([() => range.value, () => storeId.value], async ([range, storeId]) => {
    if (range && storeId) {
      const data = await getAlarmReport({ timeRange: range, storeId });
      report.value = data;
    }
  });
</script>
