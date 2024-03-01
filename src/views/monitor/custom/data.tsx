import { createEquipment, updateEquipment } from '@/api/equipment';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { formatToDate } from '@/utils/dateUtil';
import { getStore } from '@/api/store';
import { EquipmentResult } from '@/api/model/equipmentModel';
import { useFormat } from '@/utils/format';

const { formatSensor, formatStore } = useFormat();

export function getColumns(): BasicColumn<EquipmentResult>[] {
  return [
    { dataIndex: 'equipmentName', title: '设备名称', width: 120 },
    {
      dataIndex: 'store',
      title: '所属地点',
      width: 220,
      customRender: ({ text }) => formatStore(text, '()'),
    },
    { dataIndex: 'workingAmpere', title: '工作电流(A)', width: 110 },
    { dataIndex: 'electricalEnergy', title: '总耗电量(kW·h)', width: 130 },
    {
      dataIndex: 'workingHours',
      title: '工作时长(小时)',
      width: 130,
      customRender: ({ record: d }) => {
        return d.workingHours ? (d.workingHours / 3600).toFixed(2) : '';
      },
    },
    {
      dataIndex: 'sensor',
      title: '传感器',
      width: 400,
      customRender: ({ record }) => {
        return <div>{record.sensorList?.map((sensor) => formatSensor(sensor, 'tag'))}</div>;
      },
    },
    { dataIndex: 'remark', title: '备注', width: 150 },
    {
      dataIndex: 'createTime',
      title: '创建时间',
      width: 160,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      dataIndex: 'settings',
      title: '设置',
      width: 120,
      fixed: 'right',
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
        label: '设备名称',
        field: `equipmentName`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '地点',
        field: `storeInfo`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '备注',
        field: `remark`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export const modalTitle = '设备';
export type ActionKey = 'create' | 'edit';
export const createApi = createEquipment;
export const updateApi = updateEquipment;
export const getFormSchema: (actionKey?: ActionKey) => FormSchema[] = (actionKey) => {
  if (!actionKey) return [];
  return [
    {
      label: '设备名称',
      field: 'equipmentName',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
      },
      rules: [{ required: true, message: '请输入设备名称' }],
      colProps: { span: 24 },
    },
    {
      field: 'storeId',
      label: '地点',
      component: 'ApiSelect',
      componentProps: ({ formModel }) => ({
        placeholder: '请选择所属地点',
        api: getStore,
        immediate: false,
        showSearch: true,
        filterOption: false,
        labelField: 'name',
        valueField: 'id',
        searchField: 'storeInfo',
        onChange: () => {
          formModel.sensor = undefined;
        },
      }),
      dynamicRules: () => {
        return [{ required: true, message: '请选择所属地点', trigger: 'blur' }];
      },
      colProps: { span: 24 },
      ifShow: actionKey === 'create',
    },
    {
      label: '绑定传感器',
      field: 'sensor',
      slot: 'bind',
      ifShow: actionKey === 'create',
      show: ({ model }) => !!model.storeId,
    },
    {
      label: '工作电流(A)',
      field: 'workingAmpere',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入工作电流',
        style: 'width:100%',
        controls: false,
      },
      defaultValue: 0.5,
      rules: [{ required: true, message: '请输入工作电流' }],
      colProps: { span: 24 },
    },
    {
      label: '排序',
      field: 'sortNum',
      component: 'InputNumber',
      componentProps: {
        style: 'width:100%',
        controls: false,
        min: 0,
        precision: 0,
      },
      defaultValue: 0,
      colProps: { span: 24 },
    },
    {
      label: '备注',
      field: 'remark',
      component: 'InputTextArea',
      componentProps: {
        placeholder: '请输入备注',
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
};
