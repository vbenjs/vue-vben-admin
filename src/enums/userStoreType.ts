const labelText = 'label';

// STORE("具体地点"),
// AREA("区域"),
// ALL("全部"),

export type UserStoreType =
  | 'STORE' //'具体地点'
  | 'AREA' //'区域
  | 'ALL'; //'全部

export const userStoreTypeOptions = [
  { [labelText]: '具体地点', value: 'STORE' },
  // { [labelText]: '区域', value: 'AREA' },
  { [labelText]: '全部', value: 'ALL' },
];

export const userStoreTypeMap = (() => {
  const map = new Map<UserStoreType, string>();

  map.set('STORE', '具体地点');
  map.set('AREA', '区域');
  map.set('ALL', '全部');

  return map;
})();
