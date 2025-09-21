<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { formatMoney, getFieldExplain, numberWithCommas } from '#/shared/utils';
import { useShopStore } from '#/store';

import { Grid } from './table-config';

const shopStore = useShopStore();

const hasBold = (id: string) =>
  [
    'grossProfit',
    'grossSales',
    'netPayment',
    'netProfit',
    'netProfitMargin',
  ].includes(id);

const formatVal = (rowName: string, val: any) => {
  if (rowName === 'netProfitMargin') {
    return numberWithCommas(`${val}%`);
  }

  if (rowName === 'totalOrders') {
    return val;
  }

  return formatMoney(
    val,
    shopStore.shop.currencyFromApp,
    shopStore.shop.currencyRate,
  );
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #id="{ row: { id, costName } }">
        <div class="flex items-center space-x-1">
          <span v-if="!costName" :class="[{ 'font-semibold': hasBold(id) }]">
            {{ $t(`field-name.${id}`) }}
          </span>
          <span v-else>
            {{ costName }}
          </span>
          <template v-if="getFieldExplain(id)">
            <IconifyIcon
              v-tippy="{
                content: getFieldExplain(id),
                placement: 'right',
              }"
              icon="ant-design:question-circle-outlined"
            />
          </template>
        </div>
      </template>
      <template #date="{ row, column: { field } }">
        <div :class="[{ 'font-semibold': hasBold(row.id) }]">
          {{ formatVal(row.id, row[field]) }}
        </div>
      </template>
    </Grid>
  </Page>
</template>
