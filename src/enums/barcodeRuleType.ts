const labelText = 'label';

export type BarcodeRuleType =
  | 'PACKAGE' // 盒
  | 'BOX' // 箱
  | 'PALLET' // 托
  | 'OTHER'; // 其他

export const barcodeRuleTypeOptions = [
  { [labelText]: '盒', value: 'PACKAGE' },
  { [labelText]: '箱', value: 'BOX' },
  { [labelText]: '托', value: 'PALLET' },
  { [labelText]: '其他', value: 'OTHER' },
];

export const barcodeRuleTypeMap = (() => {
  const map = new Map<BarcodeRuleType, string>();

  map.set('PACKAGE', '盒');
  map.set('BOX', '箱');
  map.set('PALLET', '托');
  map.set('OTHER', '其他');

  return map;
})();
