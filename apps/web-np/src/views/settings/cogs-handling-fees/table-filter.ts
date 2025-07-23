import type { VbenFormProps } from '@vben/common-ui';

import { markRaw } from 'vue';

import { defaultRegionUUID } from '#/shared/constants';

import Select from './modules/select.vue';

const statusList = [
  {
    value: 'ACTIVE',
    label: 'Active',
    className: 'success',
  },
  {
    value: 'DRAFT',
    label: 'Draft',
    className: 'warning',
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
    className: 'error',
  },
];

export const getStatusClass = (status: string) => {
  const item = statusList.find((item) => item.value === status);
  return item ? item.className : 'default';
};

export const formOptions: VbenFormProps = {
  schema: [
    {
      component: markRaw(Select),
      defaultValue: defaultRegionUUID,
      fieldName: 'zoneUUID',
      label: 'Zone',
    },
    {
      component: 'Input',
      fieldName: 'id',
      label: 'ID',
      componentProps: {
        placeholder: 'Search by Product ID',
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
      componentProps: {
        placeholder: 'Search by Product Name',
      },
    },
    {
      component: 'Select',
      defaultValue: ['ACTIVE'],
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: statusList,
        placeholder: 'Select status',
      },
      fieldName: 'status',
      label: 'Status',
    },
  ],
  showCollapseButton: false,
  collapsed: true,
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
