import { DescItem } from '@/components/Description';
import { formatToDate } from '@/utils/dateUtil';

export const productInfoSchema: DescItem[] = [
  { field: 'code', label: '产品编码' },
  { field: 'name', label: '产品名称' },
  { field: 'spec', label: '规格' },
  { field: 'shape', label: '图形' },
  { field: 'figure', label: 'Figure' },
  { field: 'other', label: '别名' },
  { field: 'bar', label: '产品bar' },
  { field: 'pn', label: '料号' },
  { field: 'note', label: '备注' },
];

export const efficiencySchema: DescItem[] = [
  { field: 'name', label: '能效名称' },
  { field: 'code', label: '能效编码' },
  { field: 'power', label: 'Norminal' },
  { field: 'ratio', label: 'Efficiency' },
  { field: 'powerCode', label: '功率编码' },
  { field: 'ratioCode', label: '效率编码' },
  { field: 'line', label: '线路等级' },
  { field: 'voltage', label: '电压代码' },
  { field: 'other', label: '别名' },
  { field: 'bar', label: 'bar' },
  { field: 'note', label: '备注' },
];

export const otherSchema: DescItem[] = [
  {
    field: 'className',
    label: '班次',
    render: (_, data) => data?.clazz?.name,
  },
  {
    field: 'classCode',
    label: '班次编号',
    render: (_, data) => data?.clazz?.code,
  },
  {
    field: 'classOther',
    label: '班次别名',
    render: (_, data) => data?.clazz?.other,
  },
  {
    field: 'classBar',
    label: '班次条码值',
    render: (_, data) => data?.clazz?.bar,
  },
  {
    field: 'lineName',
    label: '线别',
    render: (_, data) => data?.line?.name,
  },
  {
    field: 'lineCode',
    label: '线别编号',
    render: (_, data) => data?.line?.code,
  },
  {
    field: 'lineOther',
    label: '线别别名',
    render: (_, data) => data?.line?.other,
  },
  {
    field: 'lineBar',
    label: '线别条码值',
    render: (_, data) => data?.line?.bar,
  },
  {
    field: 'pieceName',
    label: '片源',
    render: (_, data) => data?.piece?.name,
  },
  {
    field: 'pieceCode',
    label: '片源编号',
    render: (_, data) => data?.piece?.code,
  },
  {
    field: 'pieceOther',
    label: '片源别名',
    render: (_, data) => data?.piece?.other,
  },
  {
    field: 'pieceBar',
    label: '片源条码值',
    render: (_, data) => data?.piece?.bar,
  },
  {
    field: 'levelName',
    label: '等级',
    render: (_, data) => data?.level?.name,
  },
  {
    field: 'levelCode',
    label: '等级Bar',
    render: (_, data) => data?.level?.code,
  },
  {
    field: 'levelOther',
    label: '等级别名',
    render: (_, data) => data?.level?.other,
  },
  {
    field: 'levelBar',
    label: '等级条码值',
    render: (_, data) => data?.level?.bar,
  },
  {
    field: 'colorName',
    label: '颜色',
    render: (_, data) => data?.color?.name,
  },
  {
    field: 'colorCode',
    label: '颜色Bar',
    render: (_, data) => data?.color?.code,
  },
  {
    field: 'colorOther',
    label: '颜色别名',
    render: (_, data) => data?.color?.other,
  },
  {
    field: 'colorBar',
    label: '颜色条码值',
    render: (_, data) => data?.color?.bar,
  },
  {
    field: 'crystal',
    label: '单多晶类型',
    render: (_, data) => data?.crystal?.name,
  },
  {
    field: 'crystalCode',
    label: '单多晶类型编码',
    render: (_, data) => data?.crystal?.code,
  },
  {
    field: 'crystalOther',
    label: '单多晶类型别名',
    render: (_, data) => data?.crystal?.other,
  },
  {
    field: 'crystalBar',
    label: '单多晶类型条码值',
    render: (_, data) => data?.crystal?.bar,
  },
  {
    field: 'fe',
    label: 'fe',
    render: (_, data) => data?.fe?.name,
  },
  {
    field: 'feCode',
    label: 'fe编码',
    render: (_, data) => data?.fe?.code,
  },
  {
    field: 'feOther',
    label: 'fe别名',
    render: (_, data) => data?.fe?.other,
  },
  {
    field: 'feBar',
    label: 'fe条码值',
    render: (_, data) => data?.fe?.bar,
  },
  {
    field: 'be',
    label: 'be',
    render: (_, data) => data?.be?.name,
  },
  {
    field: 'beCode',
    label: 'be编码',
    render: (_, data) => data?.be?.code,
  },
  {
    field: 'beOther',
    label: 'be别名',
    render: (_, data) => data?.be?.other,
  },
  {
    field: 'beBar',
    label: 'be条码值',
    render: (_, data) => data?.be?.bar,
  },
  { field: 'binSuffix', label: 'bin后缀' },
  { field: 'timeCode', label: '出料时间' },
  { field: 'siteCode', label: '工位' },
  { field: 'impp', label: 'impp' },
  { field: 'lotCode', label: '生产批次', span: 2 },
  { field: 'qrcode', label: '二维码', span: 2 },
  { field: 'note1', label: '备注1', span: 2 },
  { field: 'note2', label: '备注2', span: 2 },
  { field: 'note3', label: '备注3', span: 2 },
  { field: 'note4', label: '备注4', span: 2 },
  { field: 'note5', label: '备注5', span: 2 },
];

export const boxCodeSchema: DescItem[] = [
  // { field: 'username', label: '打印选择' },
  {
    field: 'packingDate',
    label: '包装日期',
    render: (val: any) => {
      return formatToDate(val);
    },
  },
  { field: 'pieceCount', label: '单包片数' },
  { field: 'serialNum', label: '序列号' },
  { field: 'serialLen', label: '序列号长度' },
];
