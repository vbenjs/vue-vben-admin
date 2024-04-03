import type { SmartColumn, SmartSearchFormSchema } from '@/components/SmartTable';
import type { FormSchema } from '@/components/Form';
import { getUseYnSelectOptions } from '@/utils/form';

/**
 * 表格列表
 */
export const getTableColumns = (): SmartColumn[] => {
  return [
    {
      type: 'checkbox',
      width: 60,
      align: 'center',
      fixed: 'left',
      field: 'checkbox',
    },
    {
      field: 'repositoryCode',
      sortable: true,
      title: '{smart.kettle.repository.title.repositoryCode}',
      width: 120,
      fixed: 'left',
    },
    {
      field: 'repositoryName',
      title: '{smart.kettle.repository.title.repositoryName}',
      width: 120,
    },
    {
      field: 'type',
      sortable: true,
      title: '{smart.kettle.repository.title.type}',
      width: 120,
    },
    {
      field: 'defaultYn',
      sortable: true,
      title: '{smart.kettle.repository.title.defaultYn}',
      width: 120,
    },
    {
      field: 'useYn',
      sortable: true,
      component: 'switch',
      title: '{common.table.useYn}',
      width: 120,
    },
    {
      field: 'createTime',
      sortable: true,
      title: '{common.table.createTime}',
      width: 165,
    },
    {
      field: 'createBy',
      title: '{common.table.createUser}',
      width: 120,
    },
    {
      field: 'updateTime',
      sortable: true,
      title: '{common.table.updateTime}',
      width: 165,
    },
    {
      field: 'updateBy',
      title: '{common.table.updateUser}',
      width: 120,
    },
  ];
};

/**
 * 添加修改表单
 */
export const getFormSchemas = (t: Function): FormSchema[] => {
  return [
    {
      field: 'id',
      show: false,
      label: t('smart.kettle.repository.title.id'),
      component: 'Input',
      componentProps: {},
    },
    {
      field: 'repositoryCode',
      label: t('smart.kettle.repository.title.repositoryCode'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'repositoryName',
      label: t('smart.kettle.repository.title.repositoryName'),
      component: 'Input',
      componentProps: {},
      required: true,
    },
    {
      field: 'type',
      label: t('smart.kettle.repository.title.type'),
      component: 'SmartApiSelectDict',
      required: true,
      componentProps: {
        dictCode: 'SMART_KETTLE_REPOSITORY_TYPE',
      },
      defaultValue: '10',
    },
    {
      field: '',
      component: 'Divider',
      colProps: { span: 24 },
    },
    ...getDatabaseTypeSchemas(t),
  ];
};

/**
 * 获取数据库资源库编辑参数
 */
const getDatabaseTypeSchemas = (t: Function): FormSchema[] => {
  return [
    {
      label: t('smart.kettle.repository.form.properties.type'),
      field: 'properties.type',
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_KETTLE_DATABASE_TYPE',
      },
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.access'),
      field: 'properties.access',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.name'),
      field: 'properties.name',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.host'),
      field: 'properties.host',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.db'),
      field: 'properties.db',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.port'),
      field: 'properties.port',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.dbUser'),
      field: 'properties.dbUser',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.dbPassword'),
      field: 'properties.dbPassword',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.id'),
      field: 'properties.id',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.repositoryName'),
      field: 'properties.repositoryName',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.resUser'),
      field: 'properties.resUser',
      component: 'Input',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.resPassword'),
      field: 'properties.resPassword',
      component: 'InputPassword',
      show({ model }) {
        return model.type === '10';
      },
      required({ model }) {
        return model.type === '10';
      },
    },
    {
      label: t('smart.kettle.repository.form.properties.description'),
      field: 'properties.description',
      component: 'InputTextArea',
      show({ model }) {
        return model.type === '10';
      },
    },
  ];
};

export const getSearchFormSchemas = (t: Function): SmartSearchFormSchema[] => {
  return [
    {
      field: 'repositoryCode',
      label: t('smart.kettle.repository.title.repositoryCode'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'repositoryName',
      label: t('smart.kettle.repository.title.repositoryName'),
      component: 'Input',
      searchSymbol: 'like',
    },
    {
      field: 'type',
      label: t('smart.kettle.repository.title.type'),
      component: 'SmartApiSelectDict',
      componentProps: {
        dictCode: 'SMART_KETTLE_REPOSITORY_TYPE',
        style: { width: '140px' },
      },
      searchSymbol: '=',
    },
    {
      field: 'useYn',
      label: t('common.table.useYn'),
      component: 'Select',
      searchSymbol: '=',
      componentProps: {
        options: getUseYnSelectOptions(),
        style: { width: '100px' },
      },
      defaultValue: 1,
    },
  ];
};
