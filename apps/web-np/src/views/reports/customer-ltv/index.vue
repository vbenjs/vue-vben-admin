<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { dayjsInGMT } from '#/shared/dayjs';
import { formatMoney } from '#/shared/utils';
import { useShopStore } from '#/store';

import CustomerStatistic from './customer-statistic.vue';
import { Grid, state } from './table-config';

const shopStore = useShopStore();

const getMonth = (item: any, columnName: any) => {
  return dayjsInGMT(item.customerMonth)
    .add(columnName - 1, 'month')
    .format('YYYY-MM');
};

const getValue = (item: any, columnName: any) => {
  const month = getMonth(item, columnName);
  return formatVal(item[month] ?? 0);
};

const formatVal = (val: number) => {
  return formatMoney(
    val,
    shopStore.shop.currencyFromApp,
    shopStore.shop.currencyRate,
  );
};
</script>

<template>
  <Page>
    <Grid table-title="Customer Analytics">
      <template #id="{ row }">
        <div class="flex flex-col space-y-0">
          <div class="font-semibold">
            {{ row.id }}
          </div>
          <div class="text-xs">{{ row.quantityNew }} customer(s)</div>
        </div>
      </template>
      <template #date="{ row, column: { field } }">
        <div
          v-tippy="{
            content: getMonth(row, field),
            placement: 'right',
          }"
        >
          {{ getValue(row, field) }}
        </div>
      </template>
      <template #totalRevenue="{ row }">
        <div>
          {{ formatVal(row.totalRevenue) }}
        </div>
      </template>
    </Grid>
    <CustomerStatistic
      :items="state.tableData"
      :loading="state.loading"
      class="mt-4"
    />
  </Page>
</template>
