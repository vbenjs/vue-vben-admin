<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { getDatePreset } from '#/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import OrderStatistic from './order-statistic.vue';
import { reloadData, state } from './service';

onBeforeMount(() => {
  reloadData();
});

const handleDateChange = (date: any) => {
  state.dateRange = date;
  reloadData();
};
</script>

<template>
  <div class="p-5">
    <div class="mb-5 flex justify-between">
      <h1 class="text-md font-semibold md:text-xl">Dashboard</h1>
      <div>
        <DateRangePicker
          :model-value="state.dateRange"
          @update:model-value="handleDateChange"
          :picker-limit="30"
          :presets="
            getDatePreset(
              [
                'today',
                'last7Days',
                'last14Days',
                'lastMonth',
                'previousMonth',
                'thisMonth',
              ],
              true,
            )
          "
        />
      </div>
    </div>

    <OrderStatistic :items="[]" :loading="state.orderLoading" />
  </div>
</template>
