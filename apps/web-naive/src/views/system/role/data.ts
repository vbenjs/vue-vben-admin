import { z } from '#/adapter/form';

// 新增表单
export function useFormSchema() {
  return [
    {
      component: 'Input',
      fieldName: 'role_name',
      label: '角色名称',
      rules: z
        .string()
        .min(2, { message: '角色名称不能少于两个字符' })
        .max(10, { message: '角色名称不能多余10个字符' }),
      componentProps: {
        placeholder: '请输入角色名称',
        clearable: true,
      },
      defaultValue: 'test',
    },
    {
      component: 'Input',
      fieldName: 'role_key',
      label: 'key',
      rules: z
        .string()
        .min(2, { message: 'key不能少于两个字符' })
        .max(20, { message: 'key不能多余20个字符' }),
      componentProps: {
        placeholder: '请输入key',
        clearable: true,
      },
      defaultValue: 'test',
    },
    {
      component: 'Switch',
      fieldName: 'status',
      componentProps: {
        checkedValue: 1,
        uncheckedValue: 0,
      },
      defaultValue: 1,
      label: '状态',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入描述',
        clearable: true,
      },
      fieldName: 'role_describe',
      label: '描述',
      rules: z
        .string()
        .min(2, { message: '描述不能少于两个字符' })
        .max(255, { message: '描述不能多余255个字符' }),
      defaultValue: 'test',
    },
  ];
}

// 列表查询
export function useGridFormSchema() {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
    },
    // { component: 'Input', fieldName: 'id', label: $t('system.role.id') },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          // { label: $t('common.enabled'), value: 1 },
          // { label: $t('common.disabled'), value: 0 },
        ],
      },
      fieldName: 'status',
      // label: $t('system.role.status'),
    },
    {
      component: 'Input',
      fieldName: 'remark',
      // label: $t('system.role.remark'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      // label: $t('system.role.createTime'),
    },
  ];
}

// 表格
export function useColumns(onActionClick: any) {
  return [
    {
      field: 'id',
      title: '角色ID',
    },
    {
      field: 'role_key',
      title: 'key',
    },
    {
      field: 'role_name',
      title: '角色名称',
    },

    {
      slots: { default: 'status' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      field: 'role_describe',
      minWidth: 100,
      title: '角色描述',
    },
    {
      align: 'center',
      slots: { default: 'operation' },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
