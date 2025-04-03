<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useShopStore } from '#/store';
import { formatMoney, getFieldExplain } from '#/utils';

import { state } from './service';

defineOptions({
  name: 'CustomerStatistic',
});

const shopStore = useShopStore();

const getOverview = computed(() => {
  return [
    {
      title: 'Orders',
      value: state.orderTotal.quantityOrder,
    },
    {
      title: $t('field-name.grossSales'),
      explain: getFieldExplain('grossSales'),
      value: formatMoney(
        state.orderTotal.grossSales,
        shopStore.shop.currencyFromApp,
      ),
      isBold: true,
    },
    {
      title: 'Total Costs',
      value: formatMoney(0, shopStore.shop.currencyFromApp),
    },
    {
      title: 'Net Profit',
      value: formatMoney(
        state.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Net Profit Margin',
      value: `${state.orderTotal.netProfitMargin}%`,
    },
  ];
});

const getDetails = computed(() => {
  return [
    {
      title: $t('field-name.totalShipping'),
      value: formatMoney(
        state.orderTotal.totalShipping,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: $t('field-name.totalTip'),
      value: formatMoney(
        state.orderTotal.totalTip,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: $t('field-name.grossSales'),
      explain: getFieldExplain('grossSales'),
      value: formatMoney(
        state.orderTotal.grossSales,
        shopStore.shop.currencyFromApp,
      ),
      isBold: true,
    },
    {
      title: 'Discounts',
      value: formatMoney(
        state.orderTotal.discount,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Refunds',
      value: formatMoney(
        state.orderTotal.refund,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Revenue',
      value: formatMoney(
        state.orderTotal.netPayment,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'COGS',
      value: formatMoney(state.orderTotal.cogs, shopStore.shop.currencyFromApp),
    },
    {
      title: 'Handling Fees',
      value: formatMoney(
        state.orderTotal.handlingFees,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Shipping Costs',
      value: formatMoney(
        state.orderTotal.shippingCosts,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Transaction Fees',
      value: formatMoney(
        state.orderTotal.transactionFees,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Gross Profit',
      value: formatMoney(
        state.orderTotal.grossProfit,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Custom Costs',
      value: formatMoney(
        state.orderTotal.customCost,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Tax Collected',
      value: formatMoney(
        state.orderTotal.totalTax,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Net Profit',
      value: formatMoney(
        state.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: 'Net Profit Margin',
      value: `${state.orderTotal.netProfitMargin}%`,
    },
  ];
});
</script>

<template>
  <div
    v-loading="state.orderLoading"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  >
    <template v-for="item in getOverview" :key="item.title">
      <Card class="w-full" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">{{ item.title }}</CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between text-lg">
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </div>

  <Card
    class="mt-5 grid grid-cols-1 gap-4 pb-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    v-loading="state.orderLoading"
  >
    <template v-for="item in getDetails" :key="item.title">
      <Card class="w-full border-0" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle
            class="flex space-x-1"
            :class="item.isBold ? 'font-semibold' : 'font-normal'"
          >
            <span>
              {{ item.title }}
            </span>

            <template v-if="item.explain">
              <IconifyIcon
                v-tippy="{
                  content: item.explain,
                }"
                icon="ant-design:question-circle-outlined"
              />
            </template>
          </CardTitle>
        </CardHeader>

        <CardContent class="pb-0">
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </Card>
</template>
