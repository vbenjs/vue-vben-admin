<template>
  <div class="p-4">
    <div class="mb-4 flex">
      <YearPicker v-model="year" />
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
    <div class="w-full enter-y">
      <div class="mb-4 lg:flex">
        <AlarmYear
          class="mb-4 lg:mb-0 lg:w-1/2 lg:mr-4"
          :height="height"
          :storeId="storeId"
          :year="Number(year) - 1"
          :data="report?.monthAlarm"
        />
        <AlarmYear
          class="lg:w-1/2"
          :height="height"
          :storeId="storeId"
          :year="year"
          :data="report?.monthAlarm"
        />
      </div>
      <AlarmYoy :height="height" :storeId="storeId" :year="year" :data="report?.alarmStatis" />
    </div>
  </div>
</template>
<script lang="ts" setup name="AlarmYoy">
  import AlarmYear from './components/AlarmYear.vue';
  import AlarmYoy from './components/AlarmYoy.vue';
  import { YearPicker } from '@/components/DatePicker';
  import { ref, watch } from 'vue';
  import { getStore } from '@/api/store';
  import { useFormat } from '@/utils/format';
  import { ApiSelect } from '@/components/Form';
  import { onMountedOrActivated } from '@vben/hooks';
  import { getAlarmYoy } from '@/api/report';

  const { formatStore } = useFormat();
  const formatter = (item: any) => formatStore(item, '()');

  const height = ref('280px');
  const year = ref('');
  const storeId = ref<number>();

  const report = ref<any>();

  const hanldeChangeOptions = (array: any[]) => {
    if (!storeId.value) storeId.value = array[0].id;
  };

  onMountedOrActivated(async () => {
    window.dispatchEvent(new Event('resize'));
  });

  watch([() => year.value, () => storeId.value], async ([year, storeId]) => {
    if (!year) return;
    if (!storeId) return;
    const data = await getAlarmYoy(year, storeId);
    report.value = data;
  });
</script>
