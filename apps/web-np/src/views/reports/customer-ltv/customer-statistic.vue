<script setup lang="ts">
import type { Component } from 'vue';

import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenIcon,
} from '@vben/common-ui';

import { useShopStore } from '#/store';
import { convertRate, formatMoney, toPercentage } from '#/utils';

interface IAnalysisOverviewItem {
  icon: Component | string;
  title: string;
  value: any;
  suffix?: string;
  prefix?: string;
  explain?: string;
}

interface ILTVReportItem {
  id: string;
  netPayment: number;
  processedMonth: string;
  customerMonth: string;
  quantityNew: number;
  quantityRepurchase: number;
}

interface Props {
  items: any | ILTVReportItem[];
  loading?: boolean;
}

defineOptions({
  name: 'CustomerStatistic',
});

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  loading: false,
});

const shopStore = useShopStore();

const getItems = computed((): IAnalysisOverviewItem[] => {
  let totalCutomer = 0;
  let totalCutomerRepurchase = 0;
  let totalRevenue = 0;

  props.items.forEach((item: any) => {
    totalCutomer += item.quantityNew;
    totalCutomerRepurchase += item.quantityRepurchase;
    totalRevenue += item.netPayment;
  });

  totalRevenue = convertRate(totalRevenue, shopStore.shop.currencyRate);
  const ltv = totalCutomer ? totalRevenue / totalCutomer : 0;
  const repurchase = totalCutomer ? totalCutomerRepurchase / totalCutomer : 0;

  return [
    {
      icon: 'ant-design:usergroup-add-outlined',
      title: 'New Customers',
      value: totalCutomer,
    },
    {
      icon: 'ant-design:user-switch-outlined',
      title: 'Repurchase Rate',
      value: `${toPercentage(repurchase)}%`,
      suffix: '%',
      explain: 'Repurchase Rate = (Repurchase customers / New customers) * 100',
    },
    {
      icon: 'ant-design:dollar-circle-outlined',
      title: 'New customer revenue',
      value: formatMoney(totalRevenue, shopStore.shop.currencyFromApp),
      explain: 'Total Revenue from the new customers',
    },
    {
      icon: 'ant-design:field-time-outlined',
      title: 'Lifetime Value (LTV)',
      value: formatMoney(ltv, shopStore.shop.currencyFromApp),
      explain:
        'Lifetime Value (LTV) represents the average revenue a customer generates over their entire duration as a paying customer.',
    },
  ];
});
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <template v-for="item in getItems" :key="item.title">
      <Card
        class="w-full"
        :title="item.title"
        v-loading="props.loading"
        v-tippy="{
          content: item.explain,
          animation: 'scale',
        }"
      >
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between">
          <div class="text-xl">
            {{ item.value }}
          </div>
          <VbenIcon :icon="item.icon" class="size-8 flex-shrink-0" />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
