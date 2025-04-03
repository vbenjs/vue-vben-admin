<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { Select } from 'ant-design-vue';

import { useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import { generateDashboardData, state } from './service';

const chartRef = ref<EchartsUIType>();
const shopStore = useShopStore();
const { renderEcharts } = useEcharts(chartRef);

const chartOptions = [
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
];

onMounted(() => {
  reload();
});

const handleChangeGroupBy = (val: any) => {
  state.charts.profit.groupBy = val;

  generateDashboardData();
};

// Call reload when state.charts.profit.netProfit change
watch(
  () => state.charts.profit.netProfit,
  () => {
    reload();
  },
);

const reload = () => {
  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '1%',
      right: '1%',
      top: '8%',
    },
    series: [
      {
        name: $t('field-name.netPayment'),
        barMaxWidth: 80,
        stack: 'profit',
        data: state.charts.profit.revenue,
        type: 'bar',
      },
      {
        name: $t('field-name.totalCosts'),
        barMaxWidth: 80,
        stack: 'profit',
        color: 'red',
        data: state.charts.profit.totalCosts,
        type: 'bar',
      },
      {
        name: $t('field-name.netProfit'),
        color: '#16A537',
        data: state.charts.profit.netProfit,
        type: 'line',
        smooth: true,
        symbolSize: 7,
        lineStyle: {
          width: 3, // Đặt độ dày của đường
        },
      },
    ],
    xAxis: {
      data: state.charts.profit.xAxis,
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      orient: 'horizontal',
      right: 10,
    },
    tooltip: {
      trigger: 'axis',
      formatter(params: any) {
        const label = params[0].axisValue;
        const lines = params.map((p: any) => {
          return `${p.marker} ${p.seriesName}: ${formatMoney(p.value, shopStore.shop.currencyFromApp)}`;
        });
        return `<strong>${label}</strong><br/>${lines.join('<br/>')}`;
      },
    },
  });
};
</script>

<template>
  <Card class="mt-5">
    <CardHeader>
      <CardTitle class="flex items-center justify-between space-x-1">
        <span class="text-lg">Profit Performance</span>

        <Select
          v-model:value="state.charts.profit.groupBy"
          size="small"
          class="w-[100px]"
          :options="chartOptions"
          @change="handleChangeGroupBy"
        />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EchartsUI ref="chartRef" />
    </CardContent>
  </Card>
</template>
