<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { getDatePreset } from '#/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import OrderStatistic from './order-statistic.vue';
import ProfitChart from './profit-chart.vue';
import { loadData, state } from './service';

onBeforeMount(() => {
  loadData();
});

const handleDateChange = (date: any) => {
  state.dateRange = date;
  loadData();
};
</script>

<template>
  <div class="p-5">
    <div class="mb-5 flex justify-between">
      <h1 class="text-md font-semibold md:text-xl">Dashboard</h1>
      <div>
        <DateRangePicker
          picker-limit-name="1 year"
          :model-value="state.dateRange"
          :picker-limit="30"
          :presets="
            getDatePreset(
              [
                'today',
                'last7Days',
                'last14Days',
                'lastMonth',
                'last2Months',
                'last3Months',
                'lastYear',
                'previousMonth',
                'thisMonth',
                'thisYear',
              ],
              true,
            )
          "
          @update:model-value="handleDateChange"
        />
      </div>
    </div>

    <OrderStatistic />

    <ProfitChart />
  </div>
</template>
