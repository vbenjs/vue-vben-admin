const labelText = 'label';

export type ProductStatus =
  | 'UNTRACKED' // 未入库
  | 'PENDING' // 待入库
  | 'IN' // 已入库
  | 'OUT'; // 已出库

export const productStatusOptions = [
  { [labelText]: '未入库', value: 'UNTRACKED' },
  { [labelText]: '待入库', value: 'PENDING' },
  { [labelText]: '已入库', value: 'IN' },
  { [labelText]: '已出库', value: 'OUT' },
];

export const productStatusMap = (() => {
  const map = new Map<ProductStatus, string>();

  map.set('UNTRACKED', '未入库');
  map.set('PENDING', '待入库');
  map.set('IN', '已入库');
  map.set('OUT', '已出库');

  return map;
})();

export const productStatusColorMap = (() => {
  const map = new Map<ProductStatus, string>();

  map.set('UNTRACKED', 'red');
  map.set('PENDING', 'orange');
  map.set('IN', 'green');
  map.set('OUT', 'blue');

  return map;
})();
