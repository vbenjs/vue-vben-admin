<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod } from './service';

const chartRef = ref<EchartsUIType>();
const shopStore = useShopStore();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  reload();
});

watch(
  () => currentPeriod.pAndLReport.totalCosts,
  () => {
    reload();
  },
);

const reload = () => {
  renderEcharts({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const money = formatMoney(
          params.value,
          shopStore.shop.currencyFromApp,
          shopStore.shop.currencyRate,
        );

        return `${params.name}: ${money} (${params.percent}%)`;
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['30%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 7,
          borderColor: '#fff',
          borderWidth: 1,
        },
        label: {
          show: true,
          fontSize: 16,
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 15,
          smooth: true,
          lineStyle: {
            width: 1.5,
            color: '#666',
          },
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
          },
        },
        data: [
          {
            name: $t('field-name.totalAdSpend'),
            value: currentPeriod.pAndLReport.totalAdSpend,
          },
          {
            name: $t('field-name.totalCustomCost'),
            value: currentPeriod.pAndLReport.totalCustomCost,
          },
          {
            name: $t('field-name.transactionFees'),
            value: currentPeriod.pAndLReport.transactionFees,
          },
          {
            name: $t('field-name.shippingCosts'),
            value: currentPeriod.pAndLReport.shippingCosts,
          },
          {
            name: $t('field-name.handlingFees'),
            value: currentPeriod.pAndLReport.handlingFees,
          },
          {
            name: $t('field-name.cogs'),
            value: currentPeriod.pAndLReport.cogs,
          },
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
        <span> Cost Analytics </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <EchartsUI ref="chartRef" />
    </CardContent>
  </Card>
</template>
