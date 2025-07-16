<script setup lang="ts">
import { computed } from 'vue';

import { Card, CardContent, CardHeader, CardTitle } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import {
  currentPeriod,
  dashboardState,
  getChangePercentColor,
  previousPeriod,
} from './service';

defineOptions({
  name: 'CustomerStatistic',
});

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getOverview = computed(() => {
  return [
    {
      title: 'Orders',
      value: currentPeriod.pAndLReport.quantityOrder,
      changePercent: dashboardState.changePercent.quantityOrder,
      previousValue: previousPeriod.pAndLReport.quantityOrder,
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netPayment, currency, rate),
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netPayment,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalCosts'),
      explain: $t('field-name.totalCostsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.totalCosts, currency, rate),
      changePercent: dashboardState.changePercent.totalCosts,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalCosts,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netProfit, currency, rate),
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.pAndLReport.netProfitMargin}%`,
    },
  ];
});

const getDetails = computed(() => {
  return [
    {
      title: $t('field-name.totalShipping'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalShipping,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalShipping,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalShipping,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalTip'),
      value: formatMoney(currentPeriod.pAndLReport.totalTip, currency, rate),
      changePercent: dashboardState.changePercent.totalTip,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalTip,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.grossSales'),
      explain: $t('field-name.grossSalesExplain'),
      value: formatMoney(currentPeriod.pAndLReport.grossSales, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.grossSales,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.grossSales,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalDiscount'),
      value: formatMoney(currentPeriod.pAndLReport.discount, currency, rate),
      changePercent: dashboardState.changePercent.discount,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.discount,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalRefund'),
      value: formatMoney(currentPeriod.pAndLReport.refund, currency, rate),
      changePercent: dashboardState.changePercent.refund,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.refund,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netPayment'),
      explain: $t('field-name.netPaymentExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netPayment, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.netPayment,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netPayment,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.cogs'),
      explain: $t('field-name.cogsExplain'),
      value: formatMoney(currentPeriod.pAndLReport.cogs, currency),
      changePercent: dashboardState.changePercent.cogs,
      previousValue: formatMoney(previousPeriod.pAndLReport.cogs, currency),
    },
    {
      title: $t('field-name.handlingFees'),
      explain: $t('field-name.handlingFeesExplain'),
      value: formatMoney(
        currentPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.handlingFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.handlingFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.shippingCosts'),
      value: formatMoney(
        currentPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.shippingCosts,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.shippingCosts,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.transactionFees'),
      value: formatMoney(
        currentPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.transactionFees,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.transactionFees,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.grossProfit'),
      explain: $t('field-name.grossProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.grossProfit, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.grossProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.grossProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalTax'),
      explain: $t('field-name.totalTaxExplain'),
      value: formatMoney(currentPeriod.pAndLReport.totalTax, currency, rate),
      changePercent: dashboardState.changePercent.totalTax,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalTax,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalCustomCost'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalCustomCost,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalCustomCost,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.totalAdSpend'),
      value: formatMoney(
        currentPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
      changePercent: dashboardState.changePercent.totalAdSpend,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.totalAdSpend,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.roas'),
      explain: $t('field-name.roasExplain'),
      value: formatMoney(currentPeriod.pAndLReport.roas, currency, rate),
      changePercent: dashboardState.changePercent.roas,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.roas,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.poas'),
      explain: $t('field-name.poasExplain'),
      value: formatMoney(currentPeriod.pAndLReport.poas, currency, rate),
      changePercent: dashboardState.changePercent.poas,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.poas,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfit'),
      explain: $t('field-name.netProfitExplain'),
      value: formatMoney(currentPeriod.pAndLReport.netProfit, currency, rate),
      isBold: true,
      changePercent: dashboardState.changePercent.netProfit,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.netProfit,
        currency,
        rate,
      ),
    },
    {
      title: $t('field-name.netProfitMargin'),
      explain: $t('field-name.netProfitMarginExplain'),
      value: `${currentPeriod.pAndLReport.netProfitMargin}%`,
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
          <CardTitle
            class="flex flex-nowrap items-center justify-between text-lg"
          >
            <div class="flex flex-nowrap items-center space-x-1">
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
            </div>

            <template v-if="item.changePercent">
              <span
                :class="getChangePercentColor(item.changePercent)"
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
                :class="getChangePercentColor(item.changePercent)"
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
