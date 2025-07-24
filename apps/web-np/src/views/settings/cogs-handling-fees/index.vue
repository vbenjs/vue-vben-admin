<script lang="ts" setup>
import type { IProduct } from './table-config';

import type { INotification } from '#/store';

import { onMounted, reactive } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { capitalizeFirstLetter } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import {
  Image as AImage,
  Dropdown,
  InputNumber,
  Menu,
  MenuItem,
  message,
  Modal,
  Switch,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportCogsHandlingFees,
  productBulkUpdateFees,
  updateCogsByLastDate,
} from '#/api';
import { defaultRegionUUID, ECogsSource, EFeeLevel } from '#/shared/constants';
import { formatMoney } from '#/shared/utils';
import { useShopSettingStore, useShopStore } from '#/store';

import FormModalBulkCogsSource from './form-modal-bulk-cogs-source.vue';
import FormModalBulkFeeLevel from './form-modal-bulk-fee-level.vue';
import FormModalBulkHandlingFee from './form-modal-bulk-handling-fee.vue';
import CogsFormModal from './form-modal-cogs.vue';
import ImportFormModal from './form-modal-import.vue';
import ProductFormModal from './form-modal-product.vue';
import FormModalRecalculate from './form-modal-recalculate.vue';
import Cogs from './modules/cogs.vue';
import { gridOptions, gridState, isShopifyCogsSource } from './table-config';
import { formOptions, getStatusClass } from './table-filter';

const shopStore = useShopStore();
const shopSettingStore = useShopSettingStore();

const state = reactive({
  exporting: false,
  importing: false,
});

onMounted(() => {
  shopStore.pusherChannel.bind(
    shopStore.pusherEventName,
    (payload: INotification) => {
      switch (payload.type) {
        case 'COGSHandlingFeesExportNotification': {
          state.exporting = false;
          break;
        }

        case 'COGSHandlingFeesImportNotification': {
          state.importing = false;
          gridApi.query();
          break;
        }

        default: {
          break;
        }
      }
    },
  );
});

const [BulkCogsSourceModal, bulkCogsSourceModalApi] = useVbenModal({
  connectedComponent: FormModalBulkCogsSource,
  onClosed: () => {
    const { reload } = bulkCogsSourceModalApi.getData();

    if (reload === true) {
      gridApi.query();
    }
  },
});

const [BulkFeeLevelModal, bulkFeeLevelModalApi] = useVbenModal({
  connectedComponent: FormModalBulkFeeLevel,
  onClosed: () => {
    const { reload } = bulkFeeLevelModalApi.getData();

    if (reload === true) {
      gridApi.query();
    }
  },
});

const [BulkHandlingFeeModal, bulkHandlingFeeModalApi] = useVbenModal({
  connectedComponent: FormModalBulkHandlingFee,
  onClosed: () => {
    const { reload } = bulkHandlingFeeModalApi.getData();

    if (reload === true) {
      gridApi.query();
    }
  },
});

const [RecalculateFormContentModal, recalculateFormModalApi] = useVbenModal({
  connectedComponent: FormModalRecalculate,
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

const [ProductFormContentModal, productFormModalApi] = useVbenModal({
  connectedComponent: ProductFormModal,
  onClosed: () => {
    const { reload } = productFormModalApi.getData();

    if (reload === true) {
      gridApi.reload();
    }
  },
});

const [CogsFormContentModal, cogsFormModalApi] = useVbenModal({
  connectedComponent: CogsFormModal,
  onClosed: () => {
    const { reload, row } = cogsFormModalApi.getData();

    if (reload === true) {
      reloadGrid(row);
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  gridEvents: {
    checkboxChange: ({ records }: { records: any }) => {
      gridState.checkedItems = records;
    },
    checkboxAll: ({ records }: { records: any }) => {
      gridState.checkedItems = records;
    },
  },
});

const formatStatus = (status: string) => {
  return capitalizeFirstLetter(status.toLowerCase());
};

const openImportFormModal = () => {
  importFormModalApi
    .setData({
      zoneUUID: gridApi.formApi.form.values.zoneUUID as any,
    })
    .open();
};

const openProductFormModal = (deleteMode: boolean = false) => {
  productFormModalApi
    .setData({
      deleteMode,
      zoneUUID: gridApi.formApi.form.values.zoneUUID as any,
    })
    .open();
};

const handleFeeLevelChanged = (row: IProduct) => {
  const feeLevel =
    row.feeLevel === EFeeLevel.PRODUCT ? EFeeLevel.VARIANT : EFeeLevel.PRODUCT;

  row.loading = true;

  productBulkUpdateFees({
    feeLevel,
    regionId: row.regionId,
    selectedItems: [row],
    type: 'FEE_LEVEL',
  })
    .then(() => {
      reloadGrid(row);

      message.success({
        content: 'The request has been processed successfully.',
      });
    })
    .finally(() => {
      row.loading = false;
    });
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

  updateCogsByLastDate(payload)
    .then(() => {
      reloadGrid(row);

      message.success({
        content: 'The cost has been updated.',
      });
    })
    .finally(() => {
      row.loading = false;
    });
}, 2000);

const handleCogsSourceChanged = (row: IProduct, checked: any) => {
  row.loading = true;

  productBulkUpdateFees({
    cogsSource: checked ? ECogsSource.SHOPIFY : ECogsSource.MANUAL,
    regionId: row.regionId,
    selectedItems: [row],
    type: 'COGS_SOURCE',
  })
    .then(() => {
      reloadGrid(row);

      message.success({
        content: 'The request has been processed successfully.',
      });
    })
    .finally(() => {
      row.loading = false;
    });
};

const handleHandlingFeesChanged = useDebounceFn(
  async (row: IProduct, handlingFee: any) => {
    row.loading = true;

    productBulkUpdateFees({
      handlingFee,
      regionId: row.regionId,
      selectedItems: [row],
      type: 'HANDLING_FEES',
    })
      .then(() => {
        reloadGrid(row);

        message.success({
          content: 'The request has been processed successfully.',
        });
      })
      .finally(() => {
        row.loading = false;
      });
  },
  2000,
);

const reloadGrid = (row: IProduct) => {
  gridApi.query().then(() => {
    message.success({
      content: 'Please recalculate the cost after updating.',
    });

    if (row.isProductRow) {
      return;
    }

    const _productRow = gridApi.grid
      .getData()
      .find((c: any) => c.id === row.productId);

    if (!_productRow) {
      return;
    }

    gridApi.grid.toggleTreeExpand(_productRow);
  });
};

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

const showAddAndRemoveBtns = () => {
  return (
    gridApi.formApi.form &&
    gridApi.formApi.form.values.zoneUUID !== defaultRegionUUID
  );
};

const getBulkActionTitle = () => {
  const products = gridState.checkedItems.filter((item: IProduct) => {
    return !item.parentId;
  }).length;

  const variants = gridState.checkedItems.filter(
    (item: IProduct) => !!item.parentId,
  ).length;

  const prefix = 'Bulk action for ';

  if (products > 0 && variants > 0) {
    return `${prefix}${products} products, ${variants} variants`;
  }

  if (products > 0) {
    return `${prefix}${products} products`;
  }

  return `${prefix}${variants} variants`;
};
</script>

<template>
  <Page auto-content-height>
    <RecalculateFormContentModal />
    <ProductFormContentModal />
    <CogsFormContentModal />
    <ImportFormContentModal />
    <BulkCogsSourceModal />
    <BulkHandlingFeeModal />
    <BulkFeeLevelModal />
    <Grid>
      <template #toolbar-tools>
        <template v-if="showAddAndRemoveBtns()">
          <VbenButton
            class="mr-2 w-[100px]"
            size="sm"
            variant="destructive"
            @click="openProductFormModal(true)"
          >
            <IconifyIcon
              class="mr-2 size-4"
              icon="ant-design:minus-circle-twotone"
            />
            Remove
          </VbenButton>
          <VbenButton
            class="mr-2 w-[100px]"
            size="sm"
            type="primary"
            @click="openProductFormModal()"
          >
            <IconifyIcon
              class="mr-2 size-4"
              icon="ant-design:plus-circle-twotone"
            />
            Add
          </VbenButton>
        </template>

        <Dropdown class="mr-2" v-if="gridState.checkedItems.length > 0">
          <VbenButton size="sm" type="primary">
            <IconifyIcon class="mr-2 size-4" icon="ant-design:more-outlined" />
            {{ getBulkActionTitle() }}
          </VbenButton>
          <template #overlay>
            <Menu>
              <MenuItem
                @click="
                  bulkFeeLevelModalApi
                    .setData({
                      checkedItems: gridState.checkedItems,
                      regionId: gridApi.formApi.form.values.zoneUUID,
                    })
                    .open()
                "
              >
                Update Fee Level
              </MenuItem>
              <MenuItem
                @click="
                  bulkCogsSourceModalApi
                    .setData({
                      checkedItems: gridState.checkedItems,
                      regionId: gridApi.formApi.form.values.zoneUUID,
                    })
                    .open()
                "
              >
                Update COGS source
              </MenuItem>
              <!-- <MenuItem> Update COGS </MenuItem> -->
              <MenuItem
                @click="
                  bulkHandlingFeeModalApi
                    .setData({
                      checkedItems: gridState.checkedItems,
                      regionId: gridApi.formApi.form.values.zoneUUID,
                    })
                    .open()
                "
              >
                Update Handling Fees
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>

        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="recalculateFormModalApi.open()"
        >
          <IconifyIcon
            class="mr-2 size-4"
            icon="ant-design:calculator-twotone"
          />
          Recalculate costs
        </VbenButton>
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
        <div class="min-w-24" v-if="row.isProductRow">
          <Switch
            :class="{
              '!bg-warning-500': !row.feeLevelProduct,
            }"
            @change="handleFeeLevelChanged(row)"
            :disabled="row.variants.length <= 1"
            :loading="row.loading"
            :checked="row.feeLevelProduct"
            checked-children="Product"
            un-checked-children="Variant"
          />
        </div>
      </template>
      <template #name="{ row }: { row: IProduct }">
        <!-- Avatar and Title - Only show for parent level -->
        <div
          class="my-1 flex items-center justify-start space-x-2"
          v-if="row.isProductRow"
        >
          <div class="h-[35px] w-[35px] flex-none">
            <AImage
              :src="row.image"
              fallback="/static/images/no-image.png"
              class="!h-[35px] !w-[35px] rounded-lg border"
            />
          </div>
          <div class="ml-1 shrink">
            <!-- Two line: title & sub title -->
            <div>{{ row.name }}</div>
            <div
              class="text-muted-foreground text-xs"
              v-if="
                row.feeLevel === EFeeLevel.PRODUCT && row.variants.length > 1
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
        <Tag :color="getStatusClass(row.status)" v-if="row.isProductRow">
          {{ formatStatus(row.status) }}
        </Tag>
      </template>
      <template #price="{ row }: { row: IProduct }">
        <template v-if="row.cogsSourceShow || row.priceMin === row.priceMax">
          {{ formatMoney(row.price, shopStore.shop.currency) }}
        </template>
        <template v-else>
          {{ formatMoney(row.priceMin, shopStore.shop.currency) }}
          ~
          {{ formatMoney(row.priceMax, shopStore.shop.currency) }}
        </template>
      </template>
      <template #cogs="{ row }: { row: IProduct }">
        <Cogs
          @open-history-modal="cogsFormModalApi.setData(row).open()"
          @change="handleCOGSChanged(row, $event)"
          :product="row"
        />
      </template>
      <template #cogsSource="{ row }: { row: IProduct }">
        <div v-if="!row.cogsSourceShow">
          <VbenButton
            class="!p-0 text-xs"
            @click="gridApi.grid.toggleTreeExpand(row)"
            :disabled="row.loading"
            variant="link"
          >
            View Detail
          </VbenButton>
        </div>
        <Switch
          v-else
          :class="{
            '!bg-success-500': isShopifyCogsSource(row),
          }"
          @change="($event: any) => handleCogsSourceChanged(row, $event)"
          :disabled="row.loading"
          :loading="row.loading"
          :checked="isShopifyCogsSource(row)"
          checked-children="Shopify"
          un-checked-children="Manual"
        />
      </template>
      <template #handlingFees="{ row }: { row: IProduct }">
        <InputNumber
          v-if="row.cogsSourceShow"
          :min="0"
          :addon-after="shopStore.shop.currency"
          :disabled="row.loading"
          v-model:value="row.handlingFees"
          @change="handleHandlingFeesChanged(row, $event)"
          class="w-full min-w-20"
          size="small"
        />

        <template
          v-else-if="
            row.cogsSourceShow || row.handlingFeesMin === row.handlingFeesMax
          "
        >
          {{ formatMoney(row.handlingFeesMin, shopStore.shop.currency) }}
        </template>
        <template v-else>
          {{ formatMoney(row.handlingFeesMin, shopStore.shop.currency) }}
          ~
          {{ formatMoney(row.handlingFeesMax, shopStore.shop.currency) }}
        </template>
      </template>

      <template #margin="{ row }: { row: IProduct }">
        <template v-if="row.cogsSourceShow">
          {{ row.margin }}
        </template>
        <template v-else> _ </template>
      </template>
    </Grid>
  </Page>
</template>
