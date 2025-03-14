<script lang="ts" setup>
import type { IProduct } from './table-config';

import { onMounted, reactive } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { capitalizeFirstLetter } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import {
  Image as AImage,
  InputNumber,
  message,
  Modal,
  Switch,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportCogsHandlingFees,
  updateCalcCOGSBy as updateCalcCOGSLevel,
  updateCogsByDate,
  updateHandlingFees,
} from '#/api';
import { CostCalcLevel, defaultRegionUUID } from '#/constants';
import { AntHistory } from '#/icons';
import { useShopSettingStore, useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import CogsFormModal from './modal-cogs-form.vue';
import ImportFormModal from './modal-import-form.vue';
import ProductFormModal from './modal-product-form.vue';
import { calcMargin, formOptions, gridOptions } from './table-config';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const state = reactive({
  exporting: false,
  importing: false,
});

onMounted(() => {
  shopStore.pusherChannel.bind(
    'export',
    (payload: { type: string; url: string }) => {
      state.exporting = false;
      window.open(payload.url, '_blank');
    },
  );
});

const [ImportFormContentModal, importFormModalApi] = useVbenModal({
  connectedComponent: ImportFormModal,
  onClosed: () => {
    const { processing } = importFormModalApi.getData();

    if (processing === true) {
      state.importing = processing;
    }
  },
});

const openImportFormModal = () => {
  importFormModalApi
    .setData({
      zoneUUID: gridApi.formApi.form.values.zoneUUID as any,
    })
    .open();
};

const [ProductFormContentModal, productFormModalApi] = useVbenModal({
  connectedComponent: ProductFormModal,
  onClosed: () => {
    const { reload } = productFormModalApi.getData();

    if (reload === true) {
      gridApi.reload();
    }
  },
});

const openProductFormModal = (deleteMode: boolean = false) => {
  productFormModalApi
    .setData({
      deleteMode,
      zoneUUID: gridApi.formApi.form.values.zoneUUID as any,
    })
    .open();
};

const [CogsFormContentModal, cogsFormModalApi] = useVbenModal({
  connectedComponent: CogsFormModal,
  onClosed: () => {
    const { reload } = cogsFormModalApi.getData();

    if (reload === true) {
      gridApi.reload();
    }
  },
});

const openCogsFormModal = (row: IProduct) => {
  cogsFormModalApi.setData(row).open();
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});

const formatStatus = (status: string) => {
  return capitalizeFirstLetter(status.toLowerCase());
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'ACTIVE': {
      return 'success';
    }
    case 'ARCHIVED': {
      return 'error';
    }
    case 'DRAFT': {
      return 'warning';
    }
    default: {
      return 'default';
    }
  }
};

const handleSwitchChange = (row: IProduct) => {
  const newType =
    row.calcBy === CostCalcLevel.PRODUCT
      ? CostCalcLevel.VARIANT
      : CostCalcLevel.PRODUCT;

  row.loading = true;

  updateCalcCOGSLevel({
    productId: row.id,
    regionId: row.regionId,
    type: newType,
  }).finally(() => {
    gridApi.reload();
  });
};

const isShow = (row: IProduct) => {
  if (!row.parentId && row.calcBy === CostCalcLevel.VARIANT) {
    return false;
  }

  return true;
};

const handleCOGSChanged = useDebounceFn(async (row: IProduct, val: any) => {
  row.loading = true;

  const payload = {
    productId: row.id,
    variantId: null as any,
    regionId: row.regionId,
    date: new Date().toISOString(),
    cogs: val,
  };

  if (row.parentId) {
    payload.variantId = row.id;
    payload.productId = row.parentId;
  }

  updateCogsByDate(payload).finally(() => {
    row.loading = false;
    gridApi.reload();

    message.success({
      content: 'The cost has been updated.',
    });
  });
}, 2000);

const handleHandlingFeesChanged = useDebounceFn(
  async (row: IProduct, val: any) => {
    row.loading = true;

    const payload = {
      productId: row.id,
      variantId: null as any,
      regionId: row.regionId,
      handlingFees: val,
    };

    if (row.parentId) {
      payload.variantId = row.id;
      payload.productId = row.parentId;
    }

    updateHandlingFees(payload).finally(() => {
      row.loading = false;
      row.margin = calcMargin(row);

      message.success({
        content: 'The cost has been updated.',
      });
    });
  },
  2000,
);

const handleExport = () => {
  const zoneName = shopSettingStore.getZoneName(
    gridApi.formApi.form.values.zoneUUID,
  );

  Modal.confirm({
    title: `Export all fees from the ${zoneName} zone`,
    content:
      "While we process the download file, you can continue using the application. The file will be automatically downloaded once it's complete.",
    okText: 'Yes',
    cancelText: 'No',
    onOk: async () => {
      state.exporting = true;

      exportCogsHandlingFees({
        zoneUUID: gridApi.formApi.form.values.zoneUUID,
      });
    },
  });
};

const showAlterProductsBtn = () => {
  // return true;
  return (
    gridApi.formApi.form &&
    gridApi.formApi.form.values.zoneUUID !== defaultRegionUUID
  );
};
</script>

<template>
  <Page auto-content-height>
    <ProductFormContentModal />
    <CogsFormContentModal />
    <ImportFormContentModal />
    <Grid table-title="COGS & Handling Fees Settings">
      <template #toolbar-tools>
        <template v-if="showAlterProductsBtn()">
          <VbenButton
            class="mr-2 w-[150px]"
            size="sm"
            variant="destructive"
            @click="openProductFormModal(true)"
          >
            <IconifyIcon
              class="mr-2 size-4"
              icon="ant-design:minus-circle-twotone"
            />
            Remove products
          </VbenButton>
          <VbenButton
            class="mr-2 w-[150px]"
            size="sm"
            type="primary"
            @click="openProductFormModal()"
          >
            <IconifyIcon
              class="mr-2 size-4"
              icon="ant-design:plus-circle-twotone"
            />
            Add products
          </VbenButton>
        </template>
        <VbenButton
          :loading="state.exporting"
          size="xs"
          variant="outline"
          class="mr-2 w-[100px]"
          type="primary"
          @click="handleExport"
        >
          <IconifyIcon
            v-if="!state.exporting"
            icon="ant-design:download-outlined"
            class="mr-2 size-5"
          />
          Export
        </VbenButton>
        <VbenButton
          :loading="state.importing"
          size="xs"
          variant="outline"
          class="mr-2 w-[100px]"
          type="primary"
          @click="openImportFormModal"
        >
          <IconifyIcon
            v-if="!state.importing"
            icon="ant-design:upload-outlined"
            class="mr-2 size-5"
          />
          Import
        </VbenButton>
      </template>

      <template #level="{ row }: { row: IProduct }">
        <div class="min-w-24" v-if="!row.parentId">
          <Switch
            @change="handleSwitchChange(row)"
            :disabled="row.variants.length <= 1"
            :loading="row.loading"
            :checked="row.calcBy === CostCalcLevel.PRODUCT"
            checked-children="Product"
            un-checked-children="Variant"
          />
        </div>
      </template>
      <template #name="{ row }: { row: IProduct }">
        <!-- Avatar and Title - Only show for parent level -->
        <div
          class="my-1 flex items-center justify-start space-x-2"
          v-if="!row.parentId"
        >
          <div class="h-[35px] w-[35px] flex-none">
            <AImage
              v-if="row.image"
              :src="row.image"
              class="!h-[35px] !w-[35px] rounded-lg border"
            />
          </div>
          <div class="ml-1 shrink">
            <!-- Two line: title & sub title -->
            <div>{{ row.name }}</div>
            <div
              class="text-muted-foreground text-xs"
              v-if="
                row.calcBy === CostCalcLevel.PRODUCT && row.variants.length > 1
              "
            >
              Applies to all {{ row.variants.length }} variants
            </div>
          </div>
        </div>
        <!-- Only show for children level -->
        <div v-else class="pl-5">{{ row.name }}</div>
      </template>
      <template #status="{ row }: { row: IProduct }">
        <Tag :color="getStatusClass(row.status)" v-if="!row.parentId">
          {{ formatStatus(row.status) }}
        </Tag>
      </template>
      <template #price="{ row }: { row: IProduct }">
        <template v-if="isShow(row)">
          {{ formatMoney(row.price, shopStore.shop.currency) }}
        </template>
        <template v-else> _ </template>
      </template>
      <template #margin="{ row }: { row: IProduct }">
        <template v-if="isShow(row)">
          {{ row.margin }}
        </template>
        <template v-else> _ </template>
      </template>
      <template #cogs="{ row }: { row: IProduct }">
        <template v-if="isShow(row)">
          <div class="flex space-x-2">
            <InputNumber
              :min="0"
              :addon-after="shopStore.shop.currency"
              :disabled="row.loading"
              v-model:value="row.cogs"
              @change="handleCOGSChanged(row, $event)"
              size="small"
            />

            <VbenButton
              @click="openCogsFormModal(row)"
              :disabled="row.loading"
              variant="outline"
              size="icon"
              class="size-6"
            >
              <AntHistory class="size-4" />
            </VbenButton>
          </div>
        </template>
        <template v-else> _ </template>
      </template>
      <template #handlingFees="{ row }: { row: IProduct }">
        <template v-if="isShow(row)">
          <InputNumber
            :min="0"
            :addon-after="shopStore.shop.currency"
            :disabled="row.loading"
            v-model:value="row.handlingFees"
            @change="handleHandlingFeesChanged(row, $event)"
            class="w-full min-w-20"
            size="small"
          />
        </template>
        <template v-else> _ </template>
      </template>
    </Grid>
  </Page>
</template>
