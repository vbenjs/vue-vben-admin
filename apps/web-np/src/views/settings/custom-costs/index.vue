<script lang="ts" setup>
import type { ICustomCost } from '#/api';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCustomCost } from '#/api';
import { formatMoney, toPercentage } from '#/shared/utils';
import { useShopStore } from '#/store';
import UpgradeBtn from '#/views/shared-components/upgrade-btn.vue';

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
      gridApi.query();
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
        gridApi.query();
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
        <UpgradeBtn class="mr-2 w-[150px]" />

        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="openFormModal()"
          :disabled="shopStore.isFreeSubscription"
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
        <div v-if="row.type === CustomCostType.REVENUE_PERCENTAGE">
          {{ toPercentage(row.revenueRate) }}%
        </div>
        <div v-if="row.type === CustomCostType.GROSS_PROFIT_PERCENTAGE">
          {{ toPercentage(row.grossProfitRate) }}%
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
