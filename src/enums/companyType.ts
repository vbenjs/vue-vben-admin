const labelText = 'label';

export type CompanyType = 'GROUP' | 'BRAND' | 'SUPPLIER';

export const companyTypeOptions = [
  { [labelText]: '集团', value: 'GROUP' },
  { [labelText]: '品牌', value: 'BRAND' },
  { [labelText]: '供应商', value: 'SUPPLIER' },
];

export const companyTypeMap = (() => {
  const map = new Map<CompanyType, string>();

  map.set('GROUP', '集团');
  map.set('BRAND', '品牌');
  map.set('SUPPLIER', '供应商');

  return map;
})();
