import {
  createBaseData,
  deleteBaseData,
  getBaseData,
  modifyBaseDataStatus,
  updateBaseData,
} from '@/api/configuration/base';
import { getCustomer } from '@/api/configuration/customer';
import {
  createBaseEfficiency,
  deleteBaseEfficiency,
  getBaseEfficiency,
  modifyBaseEfficiencyStatus,
  updateBaseEfficiency,
} from '@/api/configuration/efficiency';
import {
  createBaseProduct,
  deleteBaseProduct,
  getBaseProduct,
  modifyBaseProductStatus,
  updateBaseProduct,
} from '@/api/configuration/product';
import { StatusSwitch } from '@/components/Business';
import { BasicColumn, FormProps, FormSchema } from '@/components/Table';
import { YNTag } from '@/components/Tag';
import { YN } from '@/enums/YN';
import { BaseDataType } from '@/enums/baseDataType';
import { sortFn } from '@/utils/util';

export function getApi(props: Recordable, type: BaseDataType) {
  if (type === 'PRODUCT') {
    return getBaseProduct(props, null, true);
  } else if (type === 'EFFICIENCY') {
    return getBaseEfficiency(props, null, true);
  } else {
    return getBaseData({ ...props, dataType: type }, null, true);
  }
}

export function getDeleteApi(ids: number[], type: BaseDataType) {
  if (type === 'PRODUCT') {
    return deleteBaseProduct(ids);
  } else if (type === 'EFFICIENCY') {
    return deleteBaseEfficiency(ids);
  } else {
    return deleteBaseData(ids);
  }
}

export function getEnableApi(ids: number[], status: YN, type?: BaseDataType) {
  if (type === 'PRODUCT') {
    return modifyBaseProductStatus(ids, status);
  }
  if (type === 'EFFICIENCY') {
    return modifyBaseEfficiencyStatus(ids, status);
  }
  return modifyBaseDataStatus(ids, status);
}

interface ColumnsOptions {
  sorter?: 'self' | boolean;
  canEnable?: boolean;
  showEnable?: boolean;
}

export function getColumns(
  type?: BaseDataType,
  options: ColumnsOptions = {
    sorter: true,
    canEnable: true,
    showEnable: true,
  },
): BasicColumn<any>[] {
  const { sorter, canEnable, showEnable } = options;
  let columns: BasicColumn[] = [];
  if (type === 'PRODUCT') {
    columns = [
      { title: '产品规格', dataIndex: 'spec', width: 120, sorter: sortFn('shape', sorter) },
      { title: '产品图形', dataIndex: 'shape', width: 100, sorter: sortFn('shape', sorter) },
      { title: '产品figure', dataIndex: 'figure', width: 100, sorter: sortFn('figure', sorter) },
      { title: '产品料号', dataIndex: 'pn', width: 100, sorter: sortFn('pn', sorter) },
    ];
  } else if (type === 'EFFICIENCY') {
    columns = [
      { title: '功率', dataIndex: 'power', width: 120, sorter: sortFn('power', sorter) },
      { title: '能效比', dataIndex: 'ratio', width: 100, sorter: sortFn('ratio', sorter) },
      {
        title: '功率编码',
        dataIndex: 'powerCode',
        width: 100,
        sorter: sortFn('powerCode', sorter),
      },
      {
        title: '效率编码',
        dataIndex: 'ratioCode',
        width: 100,
        sorter: sortFn('ratioCode', sorter),
      },
      { title: '线路等级', dataIndex: 'line', width: 100, sorter: sortFn('line', sorter) },
      { title: '电压代码', dataIndex: 'voltage', width: 100, sorter: sortFn('voltage', sorter) },
    ];
  }
  return [
    { title: '名称', dataIndex: 'name', width: 300, sorter: sortFn('name', sorter) },
    { title: '编码', dataIndex: 'code', width: 300, sorter: sortFn('code', sorter) },
    ...columns,
    { title: '别名', dataIndex: 'other', width: 120, sorter: sortFn('other', sorter) },
    { title: '条码值', dataIndex: 'bar', width: 100, sorter: sortFn('bar', sorter) },
    {
      title: '启用',
      dataIndex: 'enabled',
      width: 80,
      customRender: ({ record, text }) =>
        canEnable ? (
          <StatusSwitch
            api={(checked) => getEnableApi([record.id], checked, type)}
            v-model:checked={record.enabled}
            auth="baseData_enabled"
          />
        ) : (
          <YNTag text={text} trueLabel="启用" falseLabel="禁用" />
        ),
      ifShow: showEnable,
    },
    { title: '排序', dataIndex: 'sortNum', width: 60, sorter: sortFn('sortNum', sorter) },
    { title: '备注', dataIndex: 'note', width: 200 },
  ];
}

export function getFormConfig(type?: BaseDataType): Partial<FormProps> {
  const labelWidth = 80;
  let schemas: FormSchema[] = [];
  if (type === 'PRODUCT') {
    schemas = [
      {
        field: 'spec',
        label: '产品规格',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'shape',
        label: '产品图形',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'figure',
        label: '产品figure',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'pn',
        label: '产品料号',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ];
  }
  if (type === 'EFFICIENCY') {
    schemas = [
      {
        field: 'power',
        label: '功率',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'ratio',
        label: '能效比',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'powerCode',
        label: '功率编码',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'ratioCode',
        label: '效率编码',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'line',
        label: '线路等级',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'voltage',
        label: '电压代码',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ];
  }
  return {
    labelWidth,
    autoSubmitOnEnter: true,
    submitOnChange: true,
    rowProps: { gutter: 12 },
    schemas: [
      {
        field: 'name',
        label: '名称',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'code',
        label: '编码',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '客户',
        field: `customerId`,
        component: 'ApiSelect',
        componentProps: {
          api: getCustomer,
          showSearch: true,
          labelField: 'name',
          valueField: 'id',
          searchField: 'name',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      ...schemas,
      {
        field: 'other',
        label: '别名',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'bar',
        label: '条码值',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        field: 'enabled',
        label: '启用',
        component: 'Select',
        componentProps: {
          options: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
    ],
  };
}

export type ActionKey = 'create' | 'edit';
export const createApi = (type: BaseDataType, props: Recordable) => {
  if (type === 'PRODUCT') {
    return createBaseProduct(props);
  }
  if (type === 'EFFICIENCY') {
    return createBaseEfficiency(props);
  }
  return createBaseData({ ...props, dataType: type });
};

export const updateApi = (type: BaseDataType, props: Recordable) => {
  if (type === 'PRODUCT') {
    return updateBaseProduct(props);
  }
  if (type === 'EFFICIENCY') {
    return updateBaseEfficiency(props);
  }
  return updateBaseData({ ...props, dataType: type });
};

export function getFormSchema(actionKey?: ActionKey, type?: BaseDataType): FormSchema[] {
  if (!actionKey) return [];

  let form: FormSchema[] = [];
  if (type === 'PRODUCT') {
    form = [
      {
        label: '产品规格',
        field: 'spec',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '产品图形',
        field: 'shape',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '产品figure',
        field: 'figure',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '产品料号',
        field: 'pn',
        component: 'Input',

        colProps: { span: 24 },
      },
    ];
  } else if (type === 'EFFICIENCY') {
    form = [
      {
        label: '功率',
        field: 'power',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '能效比',
        field: 'ratio',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '功率编码',
        field: 'powerCode',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '效率编码',
        field: 'ratioCode',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '线路等级',
        field: 'line',
        component: 'Input',
        colProps: { span: 24 },
      },
      {
        label: '电压代码',
        field: 'voltage',
        component: 'Input',
        colProps: { span: 24 },
      },
    ];
  }

  return [
    {
      label: '名称',
      field: 'name',
      component: 'Input',
      rules: [{ required: true, message: '请填写名称' }],
      colProps: { span: 24 },
    },
    {
      label: '编码',
      field: 'code',
      component: 'Input',
      rules: [{ required: true, message: '请填写编码' }],
      colProps: { span: 24 },
    },
    ...form,
    {
      label: '别名',
      field: 'other',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      label: '条码值',
      field: 'bar',
      component: 'Input',
      colProps: { span: 24 },
    },
    {
      label: '启用',
      field: 'enabled',
      component: 'RadioGroup',
      defaultValue: 'Y',
      componentProps: {
        options: [
          { label: '是', value: 'Y' },
          { label: '否', value: 'N' },
        ],
      },
      colProps: { span: 24 },
    },
    {
      label: '排序',
      field: 'sortNum',
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
    {
      label: '备注',
      field: 'note',
      component: 'InputTextArea',
      componentProps: {
        autoSize: { minRows: 4 },
      },
      colProps: { span: 24 },
    },
  ];
}
