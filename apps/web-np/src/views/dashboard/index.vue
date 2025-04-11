<script lang="ts" setup>
import { onBeforeMount } from 'vue';

import { VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { getDatePreset, isShopifyEmbedded, openNewTab } from '#/utils';
import DateRangePicker from '#/views/shared-components/date-range-picker.vue';

import OrderStatistic from './order-statistic.vue';
import OverviewCustomCosts from './overview-custom-costs.vue';
import OverviewCustomer from './overview-customer.vue';
import OverviewOrder from './overview-order.vue';
import ProfitChart from './profit-chart.vue';
import { loadData, state } from './service';

onBeforeMount(() => {
  loadData();
});

const handleDateChange = (date: any) => {
  state.dateRange = date;
  loadData();
};

const hanleNewTab = () => {
  openNewTab();
};
</script>

<template>
  <div class="p-5">
    <div class="mb-5 flex justify-between">
      <div class="flex items-start space-x-5">
        <h1 class="text-md font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div class="flex items-start space-x-5">
        <VbenButton
          v-if="isShopifyEmbedded()"
          variant="outline"
          size="sm"
          @click="hanleNewTab"
        >
          <IconifyIcon
            icon="ant-design:fullscreen-outlined"
            class="mr-2 size-5"
          />
          Open new tab
        </VbenButton>
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

    <div
      v-loading="state.orderLoading"
      class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
    >
      <OverviewOrder />
      <OverviewCustomCosts />
      <OverviewCustomer />
    </div>
  </div>
</template>
