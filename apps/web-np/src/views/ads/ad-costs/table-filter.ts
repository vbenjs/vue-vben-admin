import type { VbenFormProps } from '@vben/common-ui';

export const formOptions: VbenFormProps = {
  commonConfig: {
    colon: true,
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  schema: [
    {
      component: 'Input',
      fieldName: 'adName',
      label: 'Ad',
      componentProps: {
        placeholder: 'Search by Ad Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adGroupName',
      label: 'Group',
      componentProps: {
        placeholder: 'Search by Group Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adCampaignName',
      label: 'Campaign',
      componentProps: {
        placeholder: 'Search by Campaign Name',
      },
    },
    {
      component: 'Input',
      fieldName: 'adAccountName',
      label: 'Ad Account',
      componentProps: {
        placeholder: 'Search by Ad Account Name',
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
  wrapperClass: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};
