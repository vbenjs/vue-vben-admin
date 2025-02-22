<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { orderTableOptions } from './table-config';

const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'RangePicker',
      componentProps: {
        // Show last week button
        presets: [
          { label: 'Today', value: [dayjs().add(-1, 'd'), dayjs()] },
          { label: 'Last 7 Days', value: [dayjs().add(-7, 'd'), dayjs()] },
          { label: 'Last 14 Days', value: [dayjs().add(-14, 'd'), dayjs()] },
          { label: 'Last 30 Days', value: [dayjs().add(-30, 'd'), dayjs()] },
          { label: 'Last 90 Days', value: [dayjs().add(-90, 'd'), dayjs()] },
          { label: 'Last year', value: [dayjs().add(-365, 'd'), dayjs()] },
          { label: 'Last 2 year', value: [dayjs().add(-730, 'd'), dayjs()] },
        ],
      },
      defaultValue: [dayjs().subtract(30, 'days'), dayjs()],
      fieldName: 'date',
      label: 'Date',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: [
          {
            value: 'AUTHORIZED',
            label: 'Authorized',
          },
          {
            value: 'PAID',
            label: 'Paid',
          },
          {
            value: 'PARTIALLY_PAID',
            label: 'Partially Paid',
          },
          {
            value: 'PARTIALLY_REFUNDED',
            label: 'Partially Refunded',
          },
          {
            value: 'PENDING',
            label: 'Pending',
          },
          {
            value: 'VOIDED',
            label: 'Voided',
          },
        ],
        placeholder: 'Payment status',
      },
      fieldName: 'financialStatus',
      label: 'Status',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Order ID',
      componentProps: {
        placeholder: ' ',
      },
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
};

const [Grid] = useVbenVxeGrid({ gridOptions: orderTableOptions, formOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="Order Report" />
  </Page>
</template>
