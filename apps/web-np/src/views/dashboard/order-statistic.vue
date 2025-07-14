<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import { currentPeriod, dashboardState, previousPeriod } from './service';

defineOptions({
  name: 'CustomerStatistic',
});

const shopStore = useShopStore();

const getOverview = computed(() => {
  return [
    {
      title: 'Orders',
      value: currentPeriod.orderTotal.quantityOrder,
      changePercent: dashboardState.changePercent.quantityOrder,
      previousValue: previousPeriod.orderTotal.quantityOrder,
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.netPayment,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.orderTotal.netPayment,
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
      changePercent: dashboardState.changePercent.totalCosts,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalCosts,
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
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: 'Profit Margin',
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
      changePercent: dashboardState.changePercent.totalShipping,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalShipping,
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
      changePercent: dashboardState.changePercent.totalTip,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalTip,
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
      changePercent: dashboardState.changePercent.grossSales,
      previousValue: formatMoney(
        previousPeriod.orderTotal.grossSales,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalDiscount'),
      value: formatMoney(
        currentPeriod.orderTotal.discount,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      changePercent: dashboardState.changePercent.discount,
      previousValue: formatMoney(
        previousPeriod.orderTotal.discount,
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
      changePercent: dashboardState.changePercent.refund,
      previousValue: formatMoney(
        previousPeriod.orderTotal.refund,
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
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.orderTotal.netPayment,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.cogs,
        shopStore.shop.currencyFromApp,
      ),
      changePercent: dashboardState.changePercent.cogs,
      previousValue: formatMoney(
        previousPeriod.orderTotal.cogs,
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
      changePercent: dashboardState.changePercent.handlingFees,
      previousValue: formatMoney(
        previousPeriod.orderTotal.handlingFees,
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
      changePercent: dashboardState.changePercent.shippingCosts,
      previousValue: formatMoney(
        previousPeriod.orderTotal.shippingCosts,
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
      changePercent: dashboardState.changePercent.transactionFees,
      previousValue: formatMoney(
        previousPeriod.orderTotal.transactionFees,
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
      changePercent: dashboardState.changePercent.grossProfit,
      previousValue: formatMoney(
        previousPeriod.orderTotal.grossProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.totalTax'),
      explain: $t('field-name.totalTaxExplain'),
      value: formatMoney(
        currentPeriod.orderTotal.totalTax,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
      changePercent: dashboardState.changePercent.totalTax,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalTax,
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
      changePercent: dashboardState.changePercent.totalCustomCost,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalCustomCost,
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
      changePercent: dashboardState.changePercent.totalAdSpend,
      previousValue: formatMoney(
        previousPeriod.orderTotal.totalAdSpend,
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
      changePercent: dashboardState.changePercent.roas,
      previousValue: formatMoney(
        previousPeriod.orderTotal.roas,
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
      changePercent: dashboardState.changePercent.poas,
      previousValue: formatMoney(
        previousPeriod.orderTotal.poas,
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
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.orderTotal.netProfit,
        shopStore.shop.currencyFromApp,
        shopStore.shop.currencyRate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.orderTotal.netProfitMargin}%`,
      isBold: true,
    },
  ];
});

const getClassColor = (value: string) => {
  if (value.includes('↓')) {
    return 'text-destructive-500';
  }

  return 'text-success-500';
};
</script>

<template>
  <div
    v-loading="dashboardState.loading"
    class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
  >
    <template v-for="item in getOverview" :key="item.title">
      <Card class="w-full" :title="item.title">
        <CardHeader class="pb-2">
          <CardTitle class="flex flex-nowrap items-center space-x-1 text-lg">
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

            <template v-if="item.changePercent">
              <span
                class="!ml-4"
                :class="getClassColor(item.changePercent)"
                v-tippy="{
                  content: item.previousValue
                    ? `Compared with ${item.previousValue}`
                    : '',
                }"
              >
                {{ item.changePercent }}
              </span>
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
            class="flex flex-nowrap items-center space-x-1"
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

            <template v-if="item.changePercent">
              <span
                class="!ml-4"
                :class="getClassColor(item.changePercent)"
                v-tippy="{
                  content: item.previousValue
                    ? `Compared with ${item.previousValue}`
                    : '',
                }"
              >
                {{ item.changePercent }}
              </span>
            </template>
          </CardTitle>
        </CardHeader>

        <CardContent class="pb-0 !text-lg">
          {{ item.value }}
        </CardContent>
      </Card>
    </template>
  </Card>
</template>
