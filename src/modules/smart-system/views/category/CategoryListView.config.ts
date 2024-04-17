import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { ComputedRef, unref } from 'vue';

export const getTableColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      field: 'categoryCode',
      title: '{system.views.category.title.categoryCode}',
      minWidth: 240,
      fixed: 'left',
      treeNode: true,
    },
    {
      field: 'categoryName',
      title: '{system.views.category.title.categoryName}',
      width: 200,
    },
    {
      field: 'seq',
      title: '{common.table.seq}',
      width: 120,
      sortable: true,
    },
    {
      field: 'remark',
      title: '{common.table.remark}',
      width: 200,
    },
    {
      field: 'createTime',
      title: '{common.table.createTime}',
      width: 170,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      title: '{common.table.updateTime}',
      width: 170,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
    {
      field: 'id',
      title: '{common.table.operation}',
      fixed: 'right',
      width: 200,
      slots: {
        default: 'table-option',
      },
    },
  ];
};

export const getFormSchemas = (
  t: Function,
  getIsPlatformTenant: ComputedRef<boolean>,
): FormSchema[] => {
  return [
    {
      field: 'id',
      label: '',
      component: 'Input',
      show: false,
    },
    {
      field: 'parentId',
      label: '',
      component: 'Input',
      show: false,
    },
    {
      field: 'parentName',
      label: t('system.views.category.title.parentName'),
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'categoryCode',
      label: t('system.views.category.title.categoryCode'),
      component: 'Input',
      required: true,
    },
    {
      field: 'categoryName',
      label: t('system.views.category.title.categoryName'),
      component: 'Input',
      required: true,
    },
    {
      field: 'seq',
      label: t('common.table.seq'),
      component: 'InputNumber',
      componentProps: {
        style: 'width: 100%',
      },
      required: true,
      defaultValue: 1,
    },
    {
      field: 'remark',
      label: t('common.table.remark'),
      component: 'InputTextArea',
    },
    {
      label: t('common.title.tenantCommonYn'),
      field: 'tenantCommonYn',
      component: 'Switch',
      defaultValue: false,
      ifShow() {
        return unref(getIsPlatformTenant);
      },
      dynamicDisabled({ model }) {
        return model.parentId !== 0;
      },
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'categoryCode',
      label: t('system.views.category.title.categoryCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'categoryCode',
      label: t('system.views.category.title.categoryName'),
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};
