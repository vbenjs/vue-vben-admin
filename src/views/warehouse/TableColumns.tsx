import { HxProduct } from '@/ApiModel/warehouse/product';
import { getCustomer } from '@/api/configuration/customer';
import { getBaseEfficiency } from '@/api/configuration/efficiency';
import { getBaseProduct } from '@/api/configuration/product';
import { BasicColumn, ExportConfigFormatter, FormProps, FormSchema } from '@/components/Table';
// import { YNTag } from '@/components/Tag';
import { billStatusColorMap, billStatusMap, billStatusOptions } from '@/enums/billStatus';
import {
  productStatusColorMap,
  productStatusMap,
  productStatusOptions,
} from '@/enums/productStatus';
import { formatToDate, formatToDateTime, today } from '@/utils/dateUtil';
import { Flex, Tag } from 'ant-design-vue';
import { HxBaseProduct } from '@/ApiModel/configuration/product';
import { productTypeMap } from '@/enums/productType';
import { HxBaseEfficiency } from '@/ApiModel/configuration/efficiency';
import { ComputedRef, computed } from 'vue';
import { getTimeTable } from '@/api/warehouse/bill';
import { BillType } from '@/enums/billType';
import { getPda } from '@/api/configuration/pda';
import { useOptionStore } from '@/store/modules/options';
import BarCode from './components/BarCode.vue';

const optionStore = useOptionStore();
optionStore.initBillType();

interface BoxCodeColumnsParams {
  ignorePalletCode?: Boolean;
  ignoreBoxCode?: Boolean;
}
export function getPackageCodeColumns({
  ignorePalletCode,
  ignoreBoxCode,
}: BoxCodeColumnsParams = {}): BasicColumn<HxProduct>[] {
  return [
    {
      title: '盒码编号',
      dataIndex: 'barCode',
      width: 200,
      resizable: true,
      fixed: 'left',
      customRender: ({ text, record }) => (
        <BarCode barcode={text} deleted={record.deleted} productType="PACKAGE" />
      ),
    },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      width: 120,
    },
    {
      title: '包装日期',
      dataIndex: 'packingDate',
      width: 120,
      sorter: true,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      width: 160,
      sorter: true,
      customRender: ({ text }) => formatToDateTime(text),
    },
    {
      title: '产品名称',
      dataIndex: ['product', 'name'],
      width: 120,
    },
    {
      title: '产品规格',
      dataIndex: ['product', 'spec'],
      width: 120,
    },
    {
      title: '料号',
      dataIndex: ['product', 'pn'],
      width: 120,
    },
    {
      title: '效率',
      dataIndex: ['efficiency', 'name'],
      width: 120,
    },
    {
      title: '所属箱',
      dataIndex: 'boxCode',
      width: 160,
      ifShow: !ignoreBoxCode,
    },
    {
      title: '所属托',
      dataIndex: 'palletCode',
      width: 160,
      ifShow: !ignorePalletCode,
    },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      customRender: ({ text }) => optionStore.getOptionName(text, 'source'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={productStatusColorMap.get(text)}>{productStatusMap.get(text)}</Tag>;
      },
    },
  ];
}

export function getPackageCodeFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    // rowProps: { gutter: 12 },
    labelWidth: 80,
    submitOnChange: true,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '条码',
        field: `barCode`,
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
      {
        label: '包装日期',
        field: `packingDate`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        defaultValue: [today, today].map((item) => formatToDate(item)).join(' - '),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建日期',
        field: 'createdTime',
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '箱码',
        field: `boxCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '产品',
        field: `productId`,
        component: 'ApiSelect',
        componentProps: {
          api: getBaseProduct,
          showSearch: true,
          formatter: (data) => data.code + '/' + data.name,
          valueField: 'id',
          searchField: 'info',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '效率',
        field: `efficiencyId`,
        component: 'ApiSelect',
        componentProps: {
          api: getBaseEfficiency,
          showSearch: true,
          formatter: (data) => data.code + '/' + data.name,
          valueField: 'id',
          searchField: 'info',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '状态',
        field: `status`,
        component: 'Select',
        componentProps: {
          options: productStatusOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '来源',
        field: `source`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initSource,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '未成箱',
        field: `noBoxCode`,
        component: 'Select',
        componentProps: {
          options: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '未成托',
        field: `noPalletCode`,
        component: 'Select',
        componentProps: {
          options: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建人',
        field: `createdName`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '已拆盒',
        field: `deleted`,
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
interface CaseCodeColumnsParams {
  ignorePalletCode?: Boolean;
}

export function getBoxCodeColumns({
  ignorePalletCode,
}: CaseCodeColumnsParams = {}): BasicColumn<HxProduct>[] {
  return [
    {
      title: '箱码编号',
      dataIndex: 'barCode',
      width: 200,
      fixed: 'left',
      customRender: ({ text, record }) => (
        <BarCode barcode={text} deleted={record.deleted} productType="BOX" />
      ),
    },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      width: 120,
    },
    {
      title: '包装日期',
      dataIndex: 'packingDate',
      width: 120,
      sorter: true,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      width: 160,
      sorter: true,
      customRender: ({ text }) => formatToDateTime(text),
    },
    { title: '总盒数', dataIndex: 'packageCount', width: 120 },
    { title: '总片数', dataIndex: 'pieceCount', width: 120 },
    { title: '产品规格', dataIndex: ['product', 'spec'], width: 120 },
    { title: '所属托', dataIndex: 'palletCode', width: 160, ifShow: !ignorePalletCode },
    // {
    //   title: '是否混装',
    //   dataIndex: 'mix',
    //   width: 100,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    // {
    //   title: '是否装满',
    //   dataIndex: 'fullBox',
    //   width: 100,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      customRender: ({ text }) => optionStore.getOptionName(text, 'source'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={productStatusColorMap.get(text)}>{productStatusMap.get(text)}</Tag>;
      },
    },
  ];
}

export function getBoxCodeFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    // rowProps: { gutter: 12 },
    labelWidth: 80,
    submitOnChange: true,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '条码',
        field: `barCode`,
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
      {
        label: '包装日期',
        field: `packingDate`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        defaultValue: [today, today].map((item) => formatToDate(item)).join(' - '),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建日期',
        field: 'createdTime',
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '产品',
        field: `productId`,
        component: 'ApiSelect',
        componentProps: {
          api: getBaseProduct,
          showSearch: true,
          formatter: (data) => data.code + '/' + data.name,
          valueField: 'id',
          searchField: 'info',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '效率',
        field: `efficiencyId`,
        component: 'ApiSelect',
        componentProps: {
          api: getBaseEfficiency,
          showSearch: true,
          formatter: (data) => data.code + '/' + data.name,
          valueField: 'id',
          searchField: 'info',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '状态',
        field: `status`,
        component: 'Select',
        componentProps: {
          options: productStatusOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '来源',
        field: `source`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initSource,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '未成托',
        field: `noPalletCode`,
        component: 'Select',
        componentProps: {
          options: [
            { label: '是', value: 'Y' },
            { label: '否', value: 'N' },
          ],
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建人',
        field: `createdName`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '已拆箱',
        field: `deleted`,
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

//托
export function getPalletCodeColumns(): BasicColumn<HxProduct>[] {
  return [
    {
      title: '托码编号',
      dataIndex: 'barCode',
      width: 200,
      fixed: 'left',
      customRender: ({ text, record }) => (
        <BarCode barcode={text} deleted={record.deleted} productType="PALLET" />
      ),
    },
    {
      title: '包装日期',
      dataIndex: 'packingDate',
      width: 120,
      sorter: true,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime',
      width: 160,
      sorter: true,
      customRender: ({ text }) => formatToDateTime(text),
    },
    { title: '总箱数', dataIndex: 'boxCount', width: 120 },
    { title: '总盒数', dataIndex: 'packageCount', width: 120 },
    { title: '总片数', dataIndex: 'pieceCount', width: 120 },
    // {
    //   title: '是否混装',
    //   dataIndex: 'mix',
    //   width: 100,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    // {
    //   title: '是否装满',
    //   dataIndex: 'fullBox',
    //   width: 100,
    //   customRender: ({ text }) => <YNTag text={text} />,
    // },
    {
      title: '来源',
      dataIndex: 'source',
      width: 120,
      customRender: ({ text }) => optionStore.getOptionName(text, 'source'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      customRender: ({ text }) => {
        return <Tag color={productStatusColorMap.get(text)}>{productStatusMap.get(text)}</Tag>;
      },
    },
  ];
}

export function getPalletCodeFormConfig(): Partial<FormProps> {
  return {
    autoSubmitOnEnter: true,
    // rowProps: { gutter: 12 },
    labelWidth: 80,
    submitOnChange: true,
    // showAdvancedButton: false,
    schemas: [
      {
        label: '条码',
        field: `barCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '包装日期',
        field: `packingDate`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        defaultValue: [today, today].map((item) => formatToDate(item)).join(' - '),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建日期',
        field: 'createdTime',
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '状态',
        field: `status`,
        component: 'Select',
        componentProps: {
          options: productStatusOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '来源',
        field: `source`,
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initSource,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建人',
        field: `createdName`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '已拆托',
        field: `deleted`,
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

export function getBillColumns(type?: BillType): ComputedRef<BasicColumn<any>[]> {
  optionStore.initStatusType();
  return computed(() => {
    const billTypeLabel = optionStore.getOptionName(type, 'billType') || '';
    return [
      {
        title: billTypeLabel ? `${billTypeLabel}单号` : '单据编号',
        dataIndex: 'billCode',
        width: 120,
        fixed: 'left',
      },
      {
        title: `${billTypeLabel}日期`,
        dataIndex: 'billDate',
        width: 120,
        sorter: true,
        customRender: ({ text }) => formatToDate(text),
      },
      {
        title: '制单人',
        dataIndex: 'createdName',
        width: 120,
        customRender: ({ text, record }) => text ?? record?.createdBy,
      },
      {
        title: '接收人',
        dataIndex: 'receiveName',
        width: 120,
        customRender: ({ text, record }) => text ?? record?.receiveBy,
      },
      {
        title: '总片数',
        dataIndex: 'pieceCount',
        width: 100,
      },
      {
        title: '单据类型',
        dataIndex: 'type',
        width: 120,
        customRender: ({ text }) => optionStore.getOptionName(text, 'billType'),
        ifShow: !type,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 120,
        customRender: ({ text }) => (
          <Tag color={billStatusColorMap.get(text)}>{billStatusMap.get(text)}</Tag>
        ),
      },
      { title: '外部单号', dataIndex: 'outCode', width: 150 },
      {
        title: '单据来源',
        dataIndex: 'source',
        width: 120,
        customRender: ({ text }) => optionStore.getOptionName(text, 'source'),
      },
      {
        title: '总托数',
        dataIndex: 'palletCount',
        width: 100,
      },
      {
        title: '总箱数',
        dataIndex: 'boxCount',
        width: 100,
      },
      {
        title: '总盒数',
        dataIndex: 'packageCount',
        width: 100,
      },
      { title: '备注', dataIndex: 'note' },
    ];
  });
}

export function getBillFormConfig(billType?: string): Partial<FormProps> {
  const typeSchema: FormSchema = {
    label: '单据类型',
    field: `type`,
    component: 'ApiSelect',
    componentProps: () => ({
      api: optionStore.initBillType,
      labelField: 'name',
      valueField: 'code',
      allowClear: false,
    }),
    defaultValue: 'SCAN',
    colProps: { md: 8, xl: 6, xxl: 4 },
  };

  const outCodeSchema: FormSchema = {
    label: '外部单号',
    field: 'outCode',
    component: 'Input',
    colProps: { md: 8, xl: 6, xxl: 4 },
  };

  const receiveSchema: FormSchema = {
    label: '接收人',
    field: 'receiveName',
    component: 'Input',
    colProps: { md: 8, xl: 6, xxl: 4 },
  };

  const config = {
    autoSubmitOnEnter: true,
    // rowProps: { gutter: 12 },
    labelWidth: 100,
    submitOnChange: true,
    schemas: [
      {
        label: '单据编号',
        field: `billCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      ...(billType === 'QUALITY' ? [outCodeSchema] : []),
      {
        label: '单据日期',
        field: `billDate`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        defaultValue: [today, today].map((item) => formatToDate(item)).join(' - '),
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '班次',
        field: `billTime`,
        component: 'ApiSelect',
        componentProps: {
          api: getTimeTable,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      ...(!billType ? [typeSchema] : []),
      {
        label: '单据状态',
        field: `status`,
        component: 'Select',
        componentProps: {
          options: billStatusOptions,
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '来源',
        field: 'source',
        component: 'ApiSelect',
        componentProps: {
          api: optionStore.initSource,
          labelField: 'name',
          valueField: 'code',
        },
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: 'PDA',
        field: 'sourceCode',
        component: 'ApiSelect',
        componentProps: () => ({
          placeholder: 'PDA',
          api: getPda,
          mode: 'multiple',
          showSearch: true,
          labelField: 'name',
          valueField: 'code',
          searchField: 'name',
        }),
        colProps: { md: 8, xl: 6, xxl: 4 },
        // ifShow: ({ model }) => model.source === 'PDA'
      },
      {
        label: '制单人',
        field: 'createdName',
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      ...(billType === 'IN' ? [receiveSchema] : []),
    ],
  } as Partial<FormProps>;

  return config;
}

export function getBillItemColumns(): BasicColumn<HxProduct>[] {
  return [
    { title: '编号', dataIndex: 'barCode', width: 200 },
    {
      title: '包装日期',
      dataIndex: 'packingDate',
      width: 120,
      customRender: ({ text }) => formatToDate(text),
    },
    {
      title: '类型',
      dataIndex: 'productType',
      width: 120,
      customRender: ({ text }) => {
        return <Tag>{productTypeMap.get(text)}</Tag>;
      },
    },
    { title: '总箱数', dataIndex: 'boxCount', width: 120 },
    { title: '总盒数', dataIndex: 'packageCount', width: 120 },
    { title: '总片数', dataIndex: 'pieceCount', width: 120 },
    {
      title: '客户',
      dataIndex: ['customer', 'name'],
      width: 120,
    },
    {
      title: '产品',
      key: 'product',
      width: 200,
      customRender: ({ record }) => {
        const product = record?.product as HxBaseProduct;
        return (
          <Flex gap="small" wrap="wrap">
            {product?.name && <Tag title="名称">{product?.name}</Tag>}
            {product?.code && <Tag title="编码">{product?.code}</Tag>}
            {product?.spec && <Tag title="规格">{product?.spec}</Tag>}
            {product?.pn && <Tag title="料号">{product?.pn}</Tag>}
          </Flex>
        );
      },
    },
    {
      title: '效率',
      key: 'efficiency',
      width: 200,
      customRender: ({ record }) => {
        const efficiency = record?.efficiency as HxBaseEfficiency;
        return (
          <Flex gap="small" wrap="wrap">
            {efficiency?.name && <Tag title="名称">{efficiency?.name}</Tag>}
            {efficiency?.code && <Tag title="编码">{efficiency?.code}</Tag>}
            {efficiency?.power && <Tag title="功率">{efficiency?.power}</Tag>}
            {efficiency?.ratio && <Tag title="能效比">{efficiency?.ratio}</Tag>}
          </Flex>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      customRender: ({ text }) => {
        return <Tag color={productStatusColorMap.get(text)}>{productStatusMap.get(text)}</Tag>;
      },
    },
  ];
}

export const useExcelExportConfig = () => {
  const YNFormatter: ExportConfigFormatter = ({ text }) => (text === 'Y' ? '是' : '否');
  const mix = { formatter: YNFormatter };
  const fullBox = { formatter: YNFormatter };
  const allMatch = { formatter: YNFormatter };
  const status = {
    formatter: (({ text }) => productStatusMap.get(text as any) ?? '') as ExportConfigFormatter,
  };

  return {
    status,
    source: {
      formatter: (({ text }) => optionStore.getOptionName(text, 'source')) as ExportConfigFormatter,
    },
    mix,
    fullBox,
    allMatch,
  };
};
