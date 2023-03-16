import { FormSchema } from '/@/components/Form';
import { listDatabases } from '/@/apis/databases';
import { listTemplateGroups } from '/@/apis/template-groups';

export const databaseFormSchemas: FormSchema[] = [
  {
    field: 'databaseId',
    component: 'ApiSelect',
    label: '数据库',
    required: true,
    componentProps: {
      api: listDatabases,
      params: {
        size: 1000,
      },
      resultField: 'content',
      labelField: 'name',
      valueField: 'id',
    },
    colProps: {
      span: 24,
    },
  },
];

export const templateGroupSchemas: FormSchema[] = [
  {
    field: 'templateGroupId',
    component: 'ApiSelect',
    label: '模板组',
    required: true,
    componentProps: {
      api: listTemplateGroups,
      params: {
        size: 1000,
      },
      resultField: 'content',
      labelField: 'name',
      valueField: 'id',
    },
    colProps: {
      span: 24,
    },
  },
];
