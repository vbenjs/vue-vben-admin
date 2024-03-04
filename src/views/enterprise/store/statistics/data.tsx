import { message } from 'ant-design-vue';
import { createEquipmentStatistics } from '@/views/common/Modals/statistics';
import { createStoreGroup, getStoreGroupMember, updateStoreGroup } from '@/api/group';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { formatToDate } from '@/utils/dateUtil';

export function getColumns(): BasicColumn[] {
  return [
    { dataIndex: 'storeName', title: '所属地点', width: 150 },
    { dataIndex: 'groupName', title: '分组名称', width: 120 },
    { dataIndex: 'mark', title: '备注', width: 160 },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 170,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      dataIndex: 'manager',
      title: '分组设备',
      width: 80,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    schemas: [
      {
        label: '分组名称',
        field: `groupName`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '分组';
export type ActionKey = 'create' | 'edit';
export const createApi = createStoreGroup;
export const updateApi = updateStoreGroup;
export const getFormSchema: () => FormSchema[] = () => {
  return [
    {
      label: '分组名称',
      field: 'groupName',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分组名称',
      },
      rules: [{ required: true, message: '请输入分组名称' }],
      colProps: { span: 24 },
    },

    {
      label: '备注',
      field: 'mark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 6 },
      },
      colProps: { span: 24 },
    },
  ];
};

export const groupStatistics = async (id: number) => {
  const data = await getStoreGroupMember(id);
  if (data.length === 0) return message.error('请先添加设备！');
  createEquipmentStatistics({
    title: `分组统计`,
    equipmentIds: data.map((item) => item.id),
  });
};
