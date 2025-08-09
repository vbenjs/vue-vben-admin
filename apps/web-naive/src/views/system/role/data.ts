import { $t } from '#/locales';

// 新增表单
export function useFormSchema() {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      // label: $t('system.role.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      // label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      // label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
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
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
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
export function useColumns(onActionClick: any, onStatusChange: any) {
  return [
    {
      field: 'id',
      title: '角色ID',
    },
    {
      field: 'role_name',
      title: '角色名称',
    },

    // {
    //   cellRender: {
    //     attrs: { beforeChange: onStatusChange },
    //     name: onStatusChange ? 'CellSwitch' : 'CellTag',
    //   },
    //   field: 'status',
    //   title: '状态',
    //   width: 100,
    // },
    // {
    //   field: 'role_describe',
    //   minWidth: 100,
    //   title: '标记',
    // },
    // {
    //   field: 'createTime',
    //   title: '创建时间',
    //   width: 200,
    // },
    // {
    //   align: 'center',
    //   cellRender: {
    //     attrs: {
    //       nameField: 'name',
    //       nameTitle: '角色',
    //       onClick: onActionClick,
    //     },
    //     name: 'CellOperation',
    //   },
    //   field: 'operation',
    //   fixed: 'right',
    //   title: '操作',
    //   width: 130,
    // },
  ];
}
