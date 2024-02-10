import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';

import { TemplateType as templateTypeConstants } from '../../constants/DatabaseConstants';
import { extensionLanguageMap } from '../../constants/Constants';

export const getTableColumns = (t: Function): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      fixed: 'left',
    },
    {
      field: 'name',
      title: '{generator.views.template.table.name}',
      width: 200,
      fixed: 'left',
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'templateType',
      title: '{generator.views.template.table.templateType}',
      width: 140,
      formatter: ({ row }: any) => {
        const templateType = templateTypeConstants[row.templateType];
        if (templateType) {
          return t(templateType.label);
        }
        return '';
      },
    },
    {
      field: 'language',
      title: '{generator.views.template.table.language}',
      width: 200,
    },
    {
      field: 'remark',
      title: '{generator.views.template.table.remark}',
      minWidth: 200,
      align: 'left',
      headerAlign: 'center',
    },
    {
      title: '{common.table.createTime}',
      field: 'createTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.createUser}',
      field: 'createBy',
      width: 120,
    },
    {
      title: '{common.table.updateTime}',
      field: 'updateTime',
      width: 165,
      sortable: true,
    },
    {
      title: '{common.table.updateUser}',
      field: 'updateBy',
      width: 120,
    },
    {
      title: '{common.table.operation}',
      field: 'operation',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'table-operation',
      },
    },
  ];
};

export const getSearchSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      label: t('generator.views.template.table.name'),
      field: 'name',
      component: 'Input',
      searchSymbol: 'like',
    },
  ];
};

export const getAddEditFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: '',
      field: 'templateId',
      component: 'Input',
      show: false,
    },
    {
      label: '',
      field: 'groupId',
      component: 'Input',
      show: false,
    },
    {
      label: t('generator.views.template.table.templateType'),
      field: 'templateType',
      component: 'Select',
      required: true,
      componentProps: {
        options: Object.keys(templateTypeConstants).map((item) => {
          const value = templateTypeConstants[item];
          return {
            value: value.value,
            label: t(value.label),
          };
        }),
      },
    },
    {
      label: t('generator.views.template.table.name'),
      field: 'name',
      component: 'Input',
      required: true,
    },
    {
      label: t('generator.views.template.table.remark'),
      field: 'remark',
      component: 'Input',
    },
    {
      label: t('generator.views.template.table.filenameSuffix'),
      field: 'filenameSuffix',
      component: 'Input',
    },
    {
      label: t('generator.views.template.table.language'),
      field: 'language',
      component: 'Select',
      componentProps: {
        options: Object.keys(extensionLanguageMap).map((item) => {
          return {
            label: extensionLanguageMap[item],
            value: item,
          };
        }),
      },
    },
    {
      label: '',
      field: 'template',
      slot: 'addEditForm-language',
      colProps: {
        span: 24,
      },
      labelWidth: 0,
      disabledLabelWidth: true,
    },
  ];
};
