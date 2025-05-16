<script lang="ts" setup>
import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Switch } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { addAdCosts } from '#/api';
import { useShopStore } from '#/store';
import { getAdsIcon } from '#/utils';

import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const handleSwitchChange = (row: any, checked: any) => {
  row.loading = true;
  addAdCosts(row.accountId, row.id, checked).finally(() => {
    gridApi.reload();
  });
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #accountType="{ row }: { row: any }">
        <div class="flex w-full items-center justify-center">
          <IconifyIcon
            class="size-[35px] text-red-500"
            :icon="getAdsIcon(row.accountType)"
          />
        </div>
      </template>
      <template #addToCosts="{ row }: { row: any }">
        <Switch
          @change="
            (checked) => {
              handleSwitchChange(row, checked);
            }
          "
          :loading="row.loading"
          :checked="row.shopIds.includes(shopStore.shop.id)"
        />
      </template>
    </Grid>
  </Page>
</template>
