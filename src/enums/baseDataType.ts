const labelText = 'label';

export type OtherDataType =
  | 'CLAZZ' // 班次
  | 'LINE' // 线别
  | 'PIECE' // 片源
  | 'CRYSTAL' // 单多晶类型
  | 'LEVEL' // 等级
  | 'COLOR' // 颜色
  | 'FE' // fe
  | 'BE'; // be

export type BaseDataType = 'PRODUCT' | 'EFFICIENCY' | OtherDataType;

export const otherDataTypeOptions: {
  label: string;
  value: OtherDataType;
}[] = [
  { [labelText]: '班次', value: 'CLAZZ' },
  { [labelText]: '线别', value: 'LINE' },
  { [labelText]: '片源', value: 'PIECE' },
  { [labelText]: '单多晶类型', value: 'CRYSTAL' },
  { [labelText]: '等级', value: 'LEVEL' },
  { [labelText]: '颜色', value: 'COLOR' },
  { [labelText]: 'fe', value: 'FE' },
  { [labelText]: 'be', value: 'BE' },
];

export const baseDataTypeOptions: {
  label: string;
  value: BaseDataType;
}[] = [
  { [labelText]: '产品', value: 'PRODUCT' },
  { [labelText]: '效率', value: 'EFFICIENCY' },
  ...otherDataTypeOptions,
];

export const baseDataTypeMap = (() => {
  const map = new Map<BaseDataType, string>();

  map.set('PRODUCT', '产品');
  map.set('EFFICIENCY', '效率');
  map.set('CLAZZ', '班次');
  map.set('LINE', '线别');
  map.set('PIECE', '片源');
  map.set('CRYSTAL', '单多晶类型');
  map.set('LEVEL', '等级');
  map.set('COLOR', '颜色');
  map.set('FE', 'fe');
  map.set('BE', 'be');

  return map;
})();
