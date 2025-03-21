<script lang="ts" setup>
import type { ICustomCost } from '#/api';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCustomCost } from '#/api';
import { useShopStore } from '#/store';
import { formatMoney, toPercentage } from '#/utils';

import FormModal from './form-modal.vue';
import { CustomCostType } from './service';
import { gridOptions } from './table-config';
import { formOptions } from './table-filter';

const shopStore = useShopStore();

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModal,
  onClosed: () => {
    const { reload } = formContentModalApi.getData();
    if (reload === true) {
      gridApi.reload();
    }
  },
});

const openFormModal = (row: ICustomCost | null = null) => {
  formContentModalApi.setData(row).open();
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const handleDelete = (row: ICustomCost) => {
  Modal.confirm({
    title: 'Delete Custom Cost',
    content: 'Are you sure you want to delete this custom cost?',
    okType: 'danger',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await deleteCustomCost([row.id]).then(() => {
        gridApi.reload();
      });
    },
  });
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />

    <Grid table-title="Custom Costs">
      <template #toolbar-tools>
        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="openFormModal()"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:plus-circle-outlined"
          />
          Add Custom Cost
        </VbenButton>
      </template>

      <template #dailyCost="{ row }: { row: ICustomCost }">
        <div
          v-if="
            row.type === CustomCostType.DAILY ||
            row.type === CustomCostType.WEEKLY ||
            row.type === CustomCostType.ONE_TIME ||
            row.type === CustomCostType.MONTHLY
          "
        >
          {{ formatMoney(row.dailyCost, shopStore.shop.currency) }}
        </div>
        <div v-if="row.type === CustomCostType.GROSS_SALE_PERCENTAGE">
          {{ toPercentage(row.grossSaleRate) }}%
        </div>
      </template>

      <template #action="{ row }: { row: ICustomCost }">
        <VbenButton
          variant="outline"
          size="icon"
          class="mr-2 size-7"
          @click="handleDelete(row)"
        >
          <IconifyIcon
            class="size-4 text-red-500"
            icon="ant-design:delete-twotone"
          />
        </VbenButton>
        <VbenButton variant="outline" size="icon" class="size-7">
          <IconifyIcon
            class="text-primary-500 size-4"
            icon="ant-design:edit-twotone"
            @click="openFormModal(row)"
          />
        </VbenButton>
      </template>
    </Grid>
  </Page>
</template>
