<script lang="ts" setup>
import type { INotification } from '#/store';

import { onMounted, reactive } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { orderDelete } from '#/api';
import { StateStatus } from '#/shared/constants';
import { showWatermark } from '#/shared/utils';
import { useShopStore, useSystemStatisticStore } from '#/store';

import FormModalOrderDetail from './form-modal-order-detail.vue';
import FormModalRecalculate from './form-modal-recalculate.vue';
import { orderTableOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();
const systemStatisticStore = useSystemStatisticStore();
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: orderTableOptions,
  formOptions,
  gridEvents: {
    checkboxChange: ({ records }: { records: any }) => {
      state.checkedItems = records;
    },
    checkboxAll: ({ records }: { records: any }) => {
      state.checkedItems = records;
    },
  },
});

const state = reactive({
  checkedItems: [] as any[],
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

  showWatermark();
});

const handleDetailOpen = (order: any) => {
  formDetailModalApi
    .setData({
      order,
    })
    .open();
};

const handleDeleteOrders = () => {
  const selectRecords: any[] = state.checkedItems.map((item) => item.id) || [];

  Modal.confirm({
    title: 'Delete Selected Orders',
    content: 'Are you sure you want to delete the selected orders?',
    okType: 'danger',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await orderDelete(selectRecords).then(() => {
        gridApi.query();
        systemStatisticStore.setCalcOrder(StateStatus.PROCESSING);
      });
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />
    <FormOrdDetailModal />
    <Grid>
      <template #name="{ row }">
        <VbenButton
          size="sm"
          variant="link"
          @click="
            handleDetailOpen(row);
            $event?.stopPropagation();
          "
          v-tippy="{
            content: `View details for ${row.name}`,
          }"
        >
          <span class="max-w-[120px] overflow-hidden text-ellipsis">
            {{ row.name }}
          </span>
        </VbenButton>
      </template>

      <template #toolbar-tools>
        <VbenButton
          class="mr-2 w-[150px]"
          size="sm"
          type="primary"
          variant="destructive"
          @click="handleDeleteOrders"
          v-if="state.checkedItems.length > 0"
        >
          <IconifyIcon class="mr-2 size-4" icon="ant-design:delete-twotone" />
          Delete {{ state.checkedItems.length || 0 }} orders
        </VbenButton>

        <VbenButton
          class="mr-2 w-[150px]"
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
