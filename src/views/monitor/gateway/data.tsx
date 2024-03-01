import { Tag } from 'ant-design-vue';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { formatLastTime, formatLastTimeColor, formatToDate } from '@/utils/dateUtil';
import { createGateway, updateGateway } from '@/api/gateway';
import { getStore, getStoreById } from '@/api/store';
import { useFormat } from '@/utils/format';
import { useEnumStoreWithOut } from '@/store/modules/enum';

const { formatStore } = useFormat();
const enumStore = useEnumStoreWithOut();

export function getColumns(): BasicColumn[] {
  return [
    {
      dataIndex: 'terminalNum',
      title: '网关编号',
      minWidth: 300,
      customRender: ({ record: d }) => {
        if (d.terminalType == 'WN') {
          let temp = d.terminalNum;
          if (d.otherInfo) {
            const otherInfo = JSON.parse(d.otherInfo);
            if (otherInfo.uid) temp += '(uid:' + otherInfo.uid + ')';
          }
          return temp;
        }
        return d.terminalNum;
      },
    },
    {
      dataIndex: 'store',
      title: '绑定地点',
      width: 220,
      customRender: ({ text }) => formatStore(text),
    },
    {
      dataIndex: 'terminalType',
      title: '网关类型',
      minWidth: 180,
      customRender: ({ text }) => enumStore.terminalTypeMap.get(text),
    },
    { dataIndex: 'mark', title: '备注', minWidth: 200 },
    {
      dataIndex: 'lastDataTime',
      title: '最近通信时间',
      width: 120,
      customRender: ({ text }) => (
        <Tag color={formatLastTimeColor(text)}>{formatLastTime(text)}</Tag>
      ),
    },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 170,
      customRender: ({ text }) => formatToDate(text),
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    rowProps: { gutter: 12 },
    labelWidth: 80,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '地点',
        field: `storeInfo`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '网关类型',
        field: `terminalType`,
        component: 'Select',
        componentProps: {
          options: enumStore.terminalTypeOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '网关编号',
        field: `terminalNum`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '网关';
export type ActionKey = 'create' | 'edit';
export const createApi = createGateway;
export const updateApi = updateGateway;
export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '网关类型',
      field: 'terminalType',
      component: 'Select',
      componentProps: {
        placeholder: '请选择网关类型',
        options: enumStore.terminalTypeOptions,
      },
      rules: [{ required: true, message: '请选择网关类型' }],
      colProps: { span: 24 },
    },
    {
      label: '网关编号',
      field: 'terminalNum',
      component: 'Input',
      componentProps: {
        placeholder: '请输入网关编号',
      },
      rules: [{ required: true, message: '请输入网关编号' }],
      colProps: { span: 24 },
    },
    {
      label: '绑定地点',
      field: 'storeId',
      component: 'ApiSelect',
      componentProps: () => ({
        api: getStore,
        getItemApi: getStoreById,
        formatter: (item: any) => formatStore(item, '()'),
        immediate: true,
        showSearch: true,
        filterOption: false,
        labelField: 'name',
        valueField: 'id',
        searchField: 'storeInfo',
      }),
      dynamicRules: () => {
        return [{ required: true, message: '请选择绑定地点', trigger: 'blur' }];
      },
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'mark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
};
