import { FormSchema } from '/@/components/Form';
import { listDatabases, listDatabaseTables } from '/@/apis/databases';
import { listTemplateGroups } from '/@/apis/template-groups';

export const databaseFormSchemas: FormSchema[] = [
  {
    field: 'databaseId',
    component: 'ApiSelect',
    label: '数据库',
    required: true,
    itemProps: { validateTrigger: 'blur' },
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

export function obtainTableFormSchemas(databaseId: number): FormSchema[] {
  return [
    {
      field: 'tables',
      component: 'ApiSelect',
      label: '数据表',
      required: true,
      itemProps: { validateTrigger: 'blur' },
      componentProps: {
        mode: 'multiple',
        api: listDatabaseTables,
        params: databaseId,
        labelField: 'remarks',
        valueField: 'name',
      },
      colProps: {
        span: 24,
      },
    },
  ];
}

export const templateGroupSchemas: FormSchema[] = [
  {
    field: 'templateGroupId',
    component: 'ApiSelect',
    label: '模板组',
    required: true,
    itemProps: { validateTrigger: 'blur' },
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
