<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod, previousPeriod } from './service';

const chartRef = ref<EchartsUIType>();
const shopStore = useShopStore();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  reload();
});

watch(
  () => [
    currentPeriod.pAndLReport.totalAdSpend,
    previousPeriod.pAndLReport.totalAdSpend,
  ],
  () => {
    reload();
  },
);

const reload = () => {
  renderEcharts({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter(params: any) {
        const title = params[0].axisValueLabel;
        const lines = params.map((p: any) => {
          const money = formatMoney(
            p.value,
            shopStore.shop.currencyFromApp,
            shopStore.shop.currencyRate,
          );

          return `${p.marker} ${p.seriesName}: ${money}`;
        });
        return `${title}<br/>${lines.join('<br/>')}`;
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
    },
    yAxis: {
      type: 'category',
      data: ['Previous Period', 'Current Period'],
    },
    series: [
      {
        name: 'Facebook',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          previousPeriod.pAndLReport.facebook,
          currentPeriod.pAndLReport.facebook,
        ],
      },
      {
        name: 'Tiktok',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series',
        },
        data: [
          previousPeriod.pAndLReport.tiktok,
          currentPeriod.pAndLReport.tiktok,
        ],
      },
    ],
  });
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between space-x-1">
        <span> Ad Analytics </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EchartsUI height="200px" ref="chartRef" />
    </CardContent>
  </Card>
</template>
