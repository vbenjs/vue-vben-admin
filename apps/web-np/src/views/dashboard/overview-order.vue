<script setup lang="ts">
import { computed } from 'vue';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  VbenButton,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { formatMoney, redirect } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod } from './service';

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getData = computed(() => {
  const avgOrderRevenue = currentPeriod.orderTotal.quantityOrder
    ? currentPeriod.orderTotal.netPayment /
      currentPeriod.orderTotal.quantityOrder
    : 0;

  const avgOrderCost = currentPeriod.orderTotal.quantityOrder
    ? currentPeriod.orderTotal.totalCosts /
      currentPeriod.orderTotal.quantityOrder
    : 0;

  const avgOrderNetProfit = currentPeriod.orderTotal.quantityOrder
    ? currentPeriod.orderTotal.netProfit /
      currentPeriod.orderTotal.quantityOrder
    : 0;

  return [
    {
      title: 'Orders',
      value: currentPeriod.orderTotal.quantityOrder,
    },
    {
      title: 'Revenue',
      value: formatMoney(currentPeriod.orderTotal.netPayment, currency, rate),
    },
    {
      title: 'Avg. order revenue',
      value: formatMoney(avgOrderRevenue, currency, rate),
      class: 'text-normal',
      explain: 'Avg. order revenue = Total revenue / Total orders',
    },
    {
      title: 'Total cost',
      value: formatMoney(currentPeriod.orderTotal.totalCosts, currency, rate),
    },
    {
      title: 'Avg. order cost',
      value: formatMoney(avgOrderCost, currency, rate),
      class: 'text-normal',
      explain: 'Avg. order cost = Total cost / Total orders',
    },
    {
      title: 'Total net profit',
      value: formatMoney(currentPeriod.orderTotal.netProfit, currency, rate),
    },
    {
      title: 'Avg. order profit',
      value: formatMoney(avgOrderNetProfit, currency, rate),
      class: 'text-normal',
      explain: 'Avg. order profit = Total net profit / Total orders',
    },
  ];
});
</script>

<template>
  <Card class="w-full" title="Order Summary">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Order Summary</span>
        <VbenButton
          class="w-[100px] !p-0 text-right"
          size="xs"
          variant="link"
          @click="redirect('reports-order')"
        >
          View details
        </VbenButton>
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
        :class="item.class ?? 'text-muted-foreground'"
      >
        <div class="flex items-center space-x-1">
          <span>{{ item.title }}</span>

          <template v-if="item.explain">
            <IconifyIcon
              v-tippy="{
                content: item.explain,
              }"
              icon="ant-design:question-circle-outlined"
            />
          </template>
        </div>
        <div>
          {{ item.value }}
        </div>
      </div>
    </CardContent>
  </Card>
</template>
