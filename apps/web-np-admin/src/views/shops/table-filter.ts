import type { VbenFormProps } from '#/adapter/form';

export const formOptions: VbenFormProps = {
  collapsed: false,
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'id',
      label: 'ID',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: 'Email',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      component: 'Input',
      fieldName: 'domain',
      label: 'Domain',
      componentProps: {
        placeholder: ' ',
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        mode: 'multiple',
        options: [
          {
            value: 'active',
            label: 'Active',
          },
          {
            value: 'uninstalled',
            label: 'Uninstalled',
          },
          {
            value: 'closed',
            label: 'Closed',
          },
        ],
        placeholder: '',
      },
      defaultValue: ['active'],
      fieldName: 'status',
      label: 'Status',
    },
  ],
  showCollapseButton: true,
  submitOnChange: true,
  submitOnEnter: false,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};
