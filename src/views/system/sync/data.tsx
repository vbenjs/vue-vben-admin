import { MesPackageForm } from '@/ApiModel/warehouse/product';
import { FormProps } from '@/components/Table';
import { BasicColumn } from '@/components/Table/src/types/table';
import { formatToDate } from '@/utils/dateUtil';

export function getColumns(): BasicColumn<MesPackageForm>[] {
  return [
    { title: '盒码', dataIndex: 'barCode', width: 300, resizable: true },
    {
      title: '客户',
      dataIndex: 'customerName',
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
      title: '总片数',
      dataIndex: 'pieceCount',
      width: 120,
    },
    {
      title: '箱码',
      dataIndex: 'boxCode',
      width: 120,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 120,
    },
    {
      title: '产品别名',
      dataIndex: 'productOther',
      width: 120,
    },
    {
      title: '产品规格',
      dataIndex: 'productSpec',
      width: 120,
    },
    {
      title: '料号',
      dataIndex: 'productPn',
      width: 120,
    },
    {
      title: '效率',
      dataIndex: 'efficiencyName',
      width: 120,
    },
    {
      title: '效率比',
      dataIndex: 'efficiencyRatio',
      width: 120,
    },
    {
      title: '功率',
      dataIndex: 'efficiencyPower',
      width: 120,
    },
    {
      title: '电压',
      dataIndex: 'efficiencyVoltage',
      width: 120,
    },
    {
      title: '等级',
      dataIndex: 'levelName',
      width: 120,
    },
    {
      title: '颜色',
      dataIndex: 'colorName',
      width: 120,
    },
    {
      title: '单多晶',
      dataIndex: 'crystalName',
      width: 120,
    },
    {
      title: '片源',
      dataIndex: 'pieceName',
      width: 120,
    },
    {
      title: '班次',
      dataIndex: 'className',
      width: 120,
    },
    {
      title: '线别',
      dataIndex: 'lineName',
      width: 120,
    },
    {
      title: 'fe',
      dataIndex: 'feName',
      width: 120,
    },
    {
      title: 'be',
      dataIndex: 'beName',
      width: 120,
    },
    {
      title: 'bin后缀',
      dataIndex: 'binSuffix',
      width: 120,
    },
    {
      title: '出料时间',
      dataIndex: 'timeCode',
      width: 120,
    },
    {
      title: '工位',
      dataIndex: 'siteCode',
      width: 120,
    },
    {
      title: '生产批次',
      dataIndex: 'lotCode',
      width: 120,
    },
    {
      title: 'impp',
      dataIndex: 'impp',
      width: 120,
    },
    {
      title: '二维码',
      dataIndex: 'qrcode',
      width: 120,
    },
    {
      title: '备注1',
      dataIndex: 'note1',
      width: 120,
    },
    {
      title: '备注2',
      dataIndex: 'note2',
      width: 120,
    },
    {
      title: '备注3',
      dataIndex: 'note3',
      width: 120,
    },
    {
      title: '备注4',
      dataIndex: 'note4',
      width: 120,
    },
    {
      title: '备注5',
      dataIndex: 'note5',
      width: 120,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    autoSubmitOnEnter: true,
    submitOnChange: true,
    schemas: [
      {
        label: '盒码',
        field: `barcode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '箱码',
        field: `boxCode`,
        component: 'Input',
        colProps: { md: 8, xl: 6, xxl: 4 },
      },
      {
        label: '创建日期',
        field: `createdTime`,
        component: 'MyRangePicker',
        componentProps: {
          valueFormat: 'YYYY-MM-DD',
          style: `width:100%;`,
        },
        colProps: { md: 12, xl: 9, xxl: 6 },
      },
    ],
  };
}
