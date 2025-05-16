import type { VbenFormProps } from '@vben/common-ui';

export const formOptions: VbenFormProps = {
  fieldMappingTime: [['date', ['from', 'to']]],
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Name',
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2',
};
