<script lang="ts" setup>
import { Page, useVbenModal, VbenButton } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import FormModalRecalculate from './form-modal-recalculate.vue';
import { orderTableOptions } from './table-config';
import { formOptions } from './table-filter';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: orderTableOptions,
  formOptions,
});

const [FormContentModal, formContentModalApi] = useVbenModal({
  connectedComponent: FormModalRecalculate,
  onClosed: () => {
    const { reload } = formContentModalApi.getData();
    if (reload === true) {
      gridApi.reload();
    }
  },
});

const handleRecalculate = () => {
  formContentModalApi.open();
};
</script>

<template>
  <Page auto-content-height>
    <FormContentModal />
    <Grid>
      <template #toolbar-tools>
        <VbenButton
          class="mr-2"
          size="sm"
          type="primary"
          @click="handleRecalculate()"
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
