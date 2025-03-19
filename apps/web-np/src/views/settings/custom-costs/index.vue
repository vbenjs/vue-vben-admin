<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ICustomCost } from '#/api';
import type { IRegion } from '#/store';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCustomCostList } from '#/api';
import { useShopSettingStore } from '#/store';
import { formatReportDate } from '#/utils';

import FormModal from './form-modal.vue';

// const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModal,
  onClosed: () => {
    const { reload } = formContentModalApi.getData();
    if (reload === true) {
      gridApi.setGridOptions({ data: shopSettingStore.regions });
    }
  },
});

const openFormModal = (row: IRegion | null = null) => {
  formContentModalApi.setData(row).open();
};

const gridOptions: VxeTableGridOptions = {
  checkboxConfig: {
    highlight: true,
    labelField: 'id',
  },
  columns: [
    {
      field: 'name',
      footerClassName: 'font-semibold',
      title: 'Name',
      minWidth: 200,
    },
    {
      field: 'startDate',
      title: 'Start date',
      formatter: (time: any) => {
        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'endDate',
      title: 'End date',
      formatter: (time: any) => {
        if (!time.cellValue) {
          return 'On going';
        }

        return formatReportDate(time.cellValue);
      },
      width: 200,
    },
    {
      field: 'type',
      title: 'Type',
      slots: { default: 'type' },
      width: 200,
    },
    {
      field: 'dailyCost',
      title: 'Daily Cost',
      width: 200,
    },
    {
      field: 'action',
      slots: { default: 'action' },
      title: 'Action',
      fixed: 'right',
      align: 'right',
      width: 100,
    },
  ],
  exportConfig: {},
  toolbarConfig: {
    search: true,
    custom: true,
    refresh: true,
    zoom: true,
  },
  height: 'auto',
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const res = await getCustomCostList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });

        return res;
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

const handleDelete = (row: IRegion) => {
  Modal.confirm({
    title: 'Delete Custom Cost',
    content: 'Are you sure you want to delete this custom cost?',
    okType: 'danger',
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      await shopSettingStore.removeRegion(row.uuid).then(() => {
        gridApi.setGridOptions({ data: shopSettingStore.regions });
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

      <template #type="{ row }: { row: ICustomCost }">
        {{ row.type }}
      </template>

      <template #action="{ row }: { row: IRegion }">
        <VbenButton
          variant="outline"
          size="icon"
          class="mr-2 size-7"
          v-if="row.uuid !== 'default'"
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
