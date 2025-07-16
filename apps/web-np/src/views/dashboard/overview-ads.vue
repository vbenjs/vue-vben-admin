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

const shopStore = useShopStore();
const currency = shopStore.shop.currencyFromApp;
const rate = shopStore.shop.currencyRate;

const getData = computed(() => {
  return [
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
      isBold: true,
    },
    {
      title: 'Facebook Ads',
      value: formatMoney(currentPeriod.pAndLReport.facebook, currency, rate),
      changePercent: dashboardState.changePercent.facebook,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.facebook,
        currency,
        rate,
      ),
    },
    {
      title: 'Tiktok Ads',
      value: formatMoney(currentPeriod.pAndLReport.tiktok, currency, rate),
      changePercent: dashboardState.changePercent.tiktok,
      previousValue: formatMoney(
        previousPeriod.pAndLReport.tiktok,
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
  ];
});
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-2">
      <CardTitle class="text-md flex items-center justify-between">
        <span>Ad Summary</span>
      </CardTitle>
    </CardHeader>

    <CardContent class="text-md">
      <div
        v-for="(item, index) in getData"
        :key="index"
        class="mt-2 flex w-full items-center justify-between"
      >
        <div
          class="flex items-center space-x-1"
          :class="item.isBold ? 'font-semibold' : ''"
        >
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
        <div class="flex space-x-2">
          <div>
            {{ item.value }}
          </div>
          <div class="w-[60px] text-right italic">
            <span
              v-if="item.changePercent && item.previousValue"
              :class="getChangePercentColor(item.changePercent)"
              v-tippy="{
                content: item.previousValue
                  ? `Compared with ${item.previousValue}`
                  : '',
              }"
            >
              {{ item.changePercent }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
