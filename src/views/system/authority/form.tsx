import { PermissionTree } from '@/api/system/model/permissionModel';
import { getPermissionTree } from '@/api/system/permission';
import { FormSchema } from '@/components/Form';
import { platformOptions } from '@/enums/platform';

export type ActionKey = 'create' | 'edit';

export const getFormSchema: (actionKey?: ActionKey, permissionId?: number) => FormSchema[] = (
  actionKey,
  permissionId,
) => {
  if (!actionKey) return [];
  return [
    {
      field: 'permissionName',
      label: '权限名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限名称',
      },
      rules: [{ required: true, message: '请输入权限名称' }],
      colProps: { span: 24 },
    },
    {
      field: 'permissionCode',
      label: '权限编码',
      component: 'Input',
      componentProps: {
        placeholder: '支持字母、数字、下划线',
      },
      rules: [
        {
          required: true,
          pattern: /^[0-9a-zA-Z_]{1,}$/,
          message: '请输入正确的权限编码,支持字母、数字、下划线',
        },
      ],
      colProps: { span: 24 },
    },

    {
      field: 'parentId',
      component: 'ApiTreeSelect',
      label: '上级权限',
      componentProps: {
        api: async () => {
          const option = await getPermissionTree();
          const format = (array?: PermissionTree[]) => {
            return array
              ?.filter((item) => item.id !== permissionId)
              ?.map((item) => {
                return {
                  // key: item.permissionCode,
                  title: item.permissionName,
                  value: item.id,
                  children: format(item.children ?? []),
                };
              });
          };
          return format(option);
        },
        // treeDataSimpleMode: true,
        allowClear: true,
        style: 'width: 100%',
      },
      colProps: { span: 24 },
    },
    {
      field: 'platform',
      component: 'Select',
      label: '所属平台',
      required: ({ model }) => {
        return !model.parentId;
      },
      componentProps: ({ formModel }) => {
        return {
          options: platformOptions,
          allowClear: true,
          disabled: !!formModel.parentId,
          style: 'width: 100%',
        };
      },
      dynamicRules({ model }) {
        return [
          {
            required: !model.parentId,
            message: '请选择所属平台',
          },
        ];
      },
      colProps: { span: 24 },
    },
    {
      field: 'sortNum',
      label: '排序',
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        min: 0,
        precision: 0,
        controls: false,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
  ];
};
