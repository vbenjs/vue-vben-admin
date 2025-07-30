import type { VbenFormProps } from '@vben/common-ui';

export const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: 'Search',
      componentProps: {
        placeholder: 'Channel name, email...',
      },
    },
    {
      component: 'Checkbox',
      fieldName: 'onlyShowActiveAdAccounts',
      label: '',
      defaultValue: false,
      renderComponentContent: () => {
        return {
          default: () => ['Only show the valid Ad Accounts'],
        };
      },
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
