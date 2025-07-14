<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenButton,
} from '@vben/common-ui';
import { $t } from '@vben/locales';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { Empty, Select } from 'ant-design-vue';

import { formatMoney, redirect } from '#/shared/utils';
import { useShopStore } from '#/store';

import {
  currentPeriod,
  dashboardState,
  generateDashboardData,
} from './service';

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
  dashboardState.profitChart.groupBy = val;

  generateDashboardData(currentPeriod);
};

// Call reload when state.charts.profit.netProfit change
watch(
  () => dashboardState.profitChart.netProfit,
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
        barMaxWidth: 20,
        stack: 'profit',
        data: dashboardState.profitChart.revenue,
        type: 'bar',
        itemStyle: {
          borderRadius: [8, 8, 0, 0],
          color: '#4C9AFF', // Màu xanh dương tươi
        },
      },
      {
        name: $t('field-name.totalCosts'),
        barMaxWidth: 20,
        stack: 'profit',
        color: 'red',
        data: dashboardState.profitChart.totalCosts,
        type: 'bar',
        itemStyle: {
          borderRadius: [0, 0, 8, 8],
          color: '#FF6B6B', // Màu đỏ hồng đẹp mắt
        },
      },
      {
        name: $t('field-name.netProfit'),
        color: '#16A537',
        data: dashboardState.profitChart.netProfit,
        type: 'line',
        smooth: true,
        symbolSize: 7,
        lineStyle: {
          width: 3,
          color: '#00C853',
          shadowColor: 'rgba(0, 200, 83, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 4,
        },
        itemStyle: {
          color: '#00C853',
        },
      },
    ],
    xAxis: {
      data: dashboardState.profitChart.xAxis,
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
        <span class="text-lg"> Profit Performance </span>

        <div class="flex items-center">
          <VbenButton
            class="w-[100px] !p-0 text-right"
            size="xs"
            variant="link"
            @click="redirect('reports-p-and-l')"
          >
            View details
          </VbenButton>

          <Select
            v-model:value="dashboardState.profitChart.groupBy"
            size="small"
            class="w-[100px]"
            :options="chartOptions"
            @change="handleChangeGroupBy"
          />
        </div>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EchartsUI
        ref="chartRef"
        v-show="dashboardState.profitChart.netProfit.length > 0"
      />

      <Empty v-show="dashboardState.profitChart.netProfit.length === 0" />
    </CardContent>
  </Card>
</template>
