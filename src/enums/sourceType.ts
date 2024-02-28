const labelText = 'label';

export type SourceType =
  | 'PC' //PC
  | 'PDA' //PDA
  | 'MANUAL' //手动导入
  | 'MES'; //MES

export const sourceTypeOptions = [
  { [labelText]: 'PC', value: 'PC' },
  { [labelText]: 'PDA', value: 'PDA' },
  { [labelText]: '手动导入', value: 'MANUAL' },
  { [labelText]: 'MES', value: 'MES' },
];

export const sourceTypeMap = (() => {
  const map = new Map<SourceType, string>();

  map.set('PC', 'PC');
  map.set('PDA', 'PDA');
  map.set('MANUAL', '手动导入');
  map.set('MES', 'MES');

  return map;
})();
