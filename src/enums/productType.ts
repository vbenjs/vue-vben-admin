const labelText = 'label';

export type ProductType = 'PACKAGE' | 'BOX' | 'PALLET';

export const productTypeOptions = [
  { [labelText]: '盒', value: 'PACKAGE' },
  { [labelText]: '箱', value: 'BOX' },
  { [labelText]: '托', value: 'PALLET' },
];

export const productTypeMap = (() => {
  const map = new Map<ProductType, string>();

  map.set('PACKAGE', '盒');
  map.set('BOX', '箱');
  map.set('PALLET', '托');

  return map;
})();
