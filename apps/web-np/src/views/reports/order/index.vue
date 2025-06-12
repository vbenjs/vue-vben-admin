<script lang="ts" setup>
import type { INotification } from '#/store';

import { onMounted } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useShopStore } from '#/store';

import FormModalOrderDetail from './form-modal-order-detail.vue';
import FormModalRecalculate from './form-modal-recalculate.vue';
import { orderTableOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: orderTableOptions,
  formOptions,
});

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModalRecalculate,
});

const [FormOrdDetailModal, formDetailModalApi] = useVbenModal({
  connectedComponent: FormModalOrderDetail,
});

onMounted(() => {
  shopStore.pusherChannel.bind(
    shopStore.pusherEventName,
    (payload: INotification) => {
      switch (payload.type) {
        case 'OrderCalculatedNotification': {
          gridApi.reload();
          break;
        }

        default: {
          break;
        }
      }
    },
  );
});

const handleDetailOpen = (order: any) => {
  formDetailModalApi
    .setData({
      order,
    })
    .open();
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />
    <FormOrdDetailModal />
    <Grid>
      <template #name="{ row }">
        <VbenButton size="sm" variant="link" @click="handleDetailOpen(row)">
          {{ row.name }}
        </VbenButton>
      </template>

      <template #toolbar-tools>
        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="formContentModalApi.open()"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:calculator-twotone"
          />
          Recalculate costs
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
