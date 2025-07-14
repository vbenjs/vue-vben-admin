<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod, dashboardState } from './service';

defineOptions({
  name: 'CustomerStatistic',
});

const shopStore = useShopStore();

const getOverview = computed(() => {
  return [
    {
      title: 'Orders',
      value: currentPeriod.orderTotal.quantityOrder,
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.netPayment,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalCosts'),
      explain: $t('field-name.totalCostsExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.totalCosts,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.orderTotal.netProfitMargin}%`,
    },
  ];
});

const getDetails = computed(() => {
  return [
    {
      title: $t('field-name.totalShipping'),
      value: formatMoney(
        currentPeriod.orderTotal.totalShipping,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalTip'),
      value: formatMoney(
        currentPeriod.orderTotal.totalTip,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.grossSales'),
      explain: $t('field-name.grossSalesExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.grossSales,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      isBold: true,
    },
    {
      title: $t('field-name.totalDiscount'),
      value: formatMoney(
        currentPeriod.orderTotal.discount,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalRefund'),
      value: formatMoney(
        currentPeriod.orderTotal.refund,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.netPayment,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      isBold: true,
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.cogs,
        shopStore.shop.currencyFromApp,
      ),
    },
    {
      title: $t('field-name.handlingFees'),
      explain: $t('field-name.handlingFeesExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.handlingFees,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.shippingCosts'),
      value: formatMoney(
        currentPeriod.orderTotal.shippingCosts,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.transactionFees'),
      value: formatMoney(
        currentPeriod.orderTotal.transactionFees,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.grossProfit'),
      explain: $t('field-name.grossProfitExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.grossProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      isBold: true,
    },
    {
      title: $t('field-name.totalTax'),
      explain: $t('field-name.totalTaxExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.totalTax,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalCustomCost'),
      value: formatMoney(
        currentPeriod.orderTotal.totalCustomCost,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalAdSpend'),
      value: formatMoney(
        currentPeriod.orderTotal.totalAdSpend,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.roas'),
      explain: $t('field-name.roasExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.roas,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.poas'),
      explain: $t('field-name.poasExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.poas,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      isBold: true,
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.orderTotal.netProfitMargin}%`,
      isBold: true,
    },
  ];
});
</script>

<template>
  <div
    v-loading="dashboardState.loading"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  >
    <template v-for="item in getOverview" :key="item.title">
      <Card class="w-full" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle class="flex items-center space-x-1 text-lg">
            <span>
              {{ item.title }}
            </span>

            <template v-if="item.explain">
              <IconifyIcon
                v-tippy="{
                  content: item.explain,
                }"
                icon="ant-design:question-circle-outlined"
                class="size-4"
              />
            </template>
          </CardTitle>
        </CardHeader>

        <CardContent class="flex items-center justify-between text-lg">
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </div>

  <Card
    class="mt-5 grid grid-cols-1 gap-4 pb-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    v-loading="dashboardState.loading"
  >
    <template v-for="item in getDetails" :key="item.title">
      <Card class="w-full border-0" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle
            class="flex items-center space-x-1"
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
