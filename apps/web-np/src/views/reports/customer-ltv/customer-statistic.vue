<script setup lang="ts">
import type { Component } from 'vue';

import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenCountToAnimator,
  VbenIcon,
} from '@vben/common-ui';

import { findCurrency } from 'currency-formatter';

import { useShopStore } from '#/store';
import { convertRate } from '#/utils';

interface IAnalysisOverviewItem {
  icon: Component | string;
  title: string;
  value: number;
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

  props.items.forEach((item) => {
    totalCutomer += item.quantityNew;
    totalCutomerRepurchase += item.quantityRepurchase;
    totalRevenue += item.netPayment;
  });

  const currencyInfo = findCurrency(shopStore.shop.currencyFromApp);

  totalRevenue = convertRate(totalRevenue, shopStore.shop.currencyRate);
  let prefixMoney = currencyInfo?.symbolOnLeft ? currencyInfo?.symbol : '';
  let suffixMoney = currencyInfo?.symbolOnLeft ? '' : currencyInfo?.symbol;

  if (currencyInfo?.spaceBetweenAmountAndSymbol) {
    if (prefixMoney) {
      prefixMoney += ' ';
    } else {
      suffixMoney = ` ${suffixMoney}`;
    }
  }

  return [
    {
      icon: 'ant-design:usergroup-add-outlined',
      title: 'New Customers',
      value: totalCutomer,
    },
    {
      icon: 'ant-design:user-switch-outlined',
      title: 'Repurchase Rate',
      value: totalCutomer ? (totalCutomerRepurchase / totalCutomer) * 100 : 0,
      suffix: '%',
      explain:
        'Repurchase Rate = (Total Repurchase Customers / Total Customers) * 100',
    },
    {
      icon: 'ant-design:dollar-circle-outlined',
      title: 'Total Revenue',
      value: totalRevenue,
      prefix: prefixMoney,
      suffix: suffixMoney,
      explain: 'Total Revenue from the new customers',
    },
    {
      icon: 'ant-design:field-time-outlined',
      title: 'Lifetime Value (LTV)',
      value: totalCutomer ? totalRevenue / totalCutomer : 0,
      prefix: prefixMoney,
      suffix: suffixMoney,
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
          <CardTitle class="text-lg">{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between">
          <VbenCountToAnimator
            :duration="0"
            :end-val="item.value"
            class="text-xl"
            :prefix="item.prefix as string"
            :suffix="item.suffix as string"
          />
          <VbenIcon :icon="item.icon" class="size-8 flex-shrink-0" />
        </CardContent>
      </Card>
    </template>
  </div>
</template>
