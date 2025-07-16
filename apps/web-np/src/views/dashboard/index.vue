<script lang="ts" setup>
import type { DashboardData } from './service';

import { computed, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

import { Button } from 'ant-design-vue';

import { DefaultRoutes } from '#/shared/constants';
import { getDatePreset } from '#/shared/utils';
import { useShopStore } from '#/store';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import OrderStatistic from './order-statistic.vue';
import OverviewAds from './overview-ads.vue';
import OverviewCostChart from './overview-cost-chart.vue';
import OverviewCosts from './overview-costs.vue';
import OverviewCustomer from './overview-customer.vue';
import OverviewOrder from './overview-order.vue';
import ProfitChart from './profit-chart.vue';
import {
  currentPeriod,
  dashboardState,
  loadDataByPeriod,
  previousPeriod,
} from './service';

const query = useRoute();
const shopStore = useShopStore();

onBeforeMount(() => {
  if (query.path === DefaultRoutes.PRICING) {
    shopStore.updateSubscriptionInfo();
  }

  loadAllData();
});

const loadAllData = () => {
  loadDataByPeriod(currentPeriod);
  loadDataByPeriod(previousPeriod);
};

const handleDateChange = (
  date: any,
  payload: DashboardData,
  changePreviousPeriod = false,
) => {
  payload.dateRange = date;
  payload.dateRangeChanged = true;

  if (changePreviousPeriod) {
    previousPeriod.dateRange = generateSamePeriodPreset.value[0]?.value as any;
    previousPeriod.dateRangeChanged = true;
  }
};

const generateSamePeriodPreset = computed(() => {
  const days =
    currentPeriod.dateRange[1].diff(currentPeriod.dateRange[0], 'days') + 1; // +1 to include the end date

  return [
    {
      label: 'Same Period',
      value: [
        currentPeriod.dateRange[0].add(-1 * days, 'days'),
        currentPeriod.dateRange[0].add(-1, 'days'),
      ],
    },
  ];
});
</script>

<template>
  <div class="p-5">
    <div class="mb-5 flex flex-wrap justify-between">
      <div class="flex items-start space-x-5">
        <h1 class="text-md font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div class="flex flex-wrap items-center justify-end space-x-0">
        <DateRangePicker
          picker-limit-name="1 year"
          :model-value="currentPeriod.dateRange"
          :allow-clear="false"
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
          @update:model-value="
            (val) => handleDateChange(val, currentPeriod, true)
          "
        />
        <div class="text-nowrap px-5">Compare with</div>
        <DateRangePicker
          picker-limit-name="1 year"
          :model-value="previousPeriod.dateRange"
          :allow-clear="false"
          :presets="generateSamePeriodPreset"
          @update:model-value="
            (val) => handleDateChange(val, previousPeriod, false)
          "
        />
        <Button
          :disabled="
            dashboardState.loading ||
            !currentPeriod.dateRangeChanged ||
            !currentPeriod.dateRangeChanged
          "
          @click="loadAllData"
          type="primary"
          class="!ml-2"
        >
          Submit
        </Button>
      </div>
    </div>

    <OrderStatistic />
    <ProfitChart />

    <div
      v-loading="dashboardState.loading"
      class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <OverviewCostChart class="xl:col-span-2" />
      <OverviewCosts />
    </div>

    <div
      v-loading="dashboardState.loading"
      class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <OverviewOrder />
      <OverviewCustomer />
      <OverviewAds />
    </div>
  </div>
</template>
