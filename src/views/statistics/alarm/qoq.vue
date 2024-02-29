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
      <AlarmYear class="mb-4" :height="height" :data="report?.monthAlarm" :year="year" />
      <AlarmQoq :height="height" :data="report?.alarmStatis" :year="year" />
    </div>
  </div>
</template>
<script lang="ts" setup name="AlarmQoq">
  import AlarmYear from './components/AlarmYear.vue';
  import AlarmQoq from './components/AlarmQoq.vue';
  import { YearPicker } from '@/components/DatePicker';
  import { ref, watch } from 'vue';
  import { getStore } from '@/api/store';
  import { useFormat } from '@/utils/format';
  import { ApiSelect } from '@/components/Form';
  import { onMountedOrActivated } from '@vben/hooks';
  import { getAlarmQoq } from '@/api/report';

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
    const data = await getAlarmQoq(year, storeId);
    report.value = data;
  });
</script>
