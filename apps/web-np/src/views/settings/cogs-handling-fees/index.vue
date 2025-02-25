<script lang="ts" setup>
import type { IProduct } from './table-config';

import type { VbenFormProps } from '#/adapter/form';

import { markRaw } from 'vue';

import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { capitalizeFirstLetter } from '@vben/utils';

import { useDebounceFn } from '@vueuse/core';
import {
  Image as AImage,
  InputNumber,
  message,
  Switch,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { updateCalcCOGSBy, updateCogsByDate, updateHandlingFees } from '#/api';
import { CostCalcLevel } from '#/constants';
import { AntHistory } from '#/icons';
import { useShopSettingStore, useShopStore } from '#/store';
import { formatMoney } from '#/utils';

import FormModal from './form-modal.vue';
import Select from './modules/select.vue';
import { calcMargin, costTableOptions } from './table-config';

const shopSettingStore = useShopSettingStore();
const shopStore = useShopStore();

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModal,
});

const formOptions: VbenFormProps = {
  schema: [
    {
      component: markRaw(Select),
      defaultValue: shopSettingStore.defaulRegion.uuid,
      fieldName: 'zoneUUID',
      label: 'Zone',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: [
          {
            value: 'ACTIVE',
            label: 'Active',
          },
          {
            value: 'DRAFT',
            label: 'Draft',
          },
          {
            value: 'ARCHIVED',
            label: 'Archived',
          },
        ],
      },
      fieldName: 'status',
      label: 'Status',
    },
    {
      component: 'Checkbox',
      fieldName: 'onlyZeroCOGS',
      label: '',
      renderComponentContent: () => {
        return {
          default: () => ['Only show zero COGS'],
        };
      },
    },
  ],
  collapsed: true,
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: true,
  showDefaultActions: true,
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: costTableOptions,
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

  updateCalcCOGSBy({
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
    row.margin = calcMargin(row);

    message.success({
      content: 'The cost has been updated.',
    });
  });
}, 3000);

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

const openFormModal = (row: IProduct) => {
  formContentModalApi.setData(row).open();
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />
    <Grid table-title="COGS & Handling Fees Settings">
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
        <div class="my-1 flex items-center justify-start" v-if="!row.parentId">
          <div class="h-[35px] w-[35px] min-w-5 flex-none object-cover">
            <AImage :src="row.image" class="rounded-lg border" />
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
              @click="openFormModal(row)"
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
