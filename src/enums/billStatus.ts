export type BillStatus =
  | 'DRAFT' //制单
  | 'WAIT_RECEIVE' //等待接收
  | 'RECEIVING' //接收中
  | 'COMPLETE' //完成
  | 'CANCELED' //取消
  | string;

export const billStatusOptions = [
  { label: '制单', value: 'DRAFT' },
  { label: '等待接收', value: 'WAIT_RECEIVE' },
  { label: '接收中', value: 'RECEIVING' },
  { label: '完成', value: 'COMPLETE' },
  { label: '取消', value: 'CANCELED' },
];

export const billStatusMap = (() => {
  const map = new Map<BillStatus, string>();

  map.set('DRAFT', '制单');
  map.set('WAIT_RECEIVE', '等待接收');
  map.set('RECEIVING', '接收中');
  map.set('COMPLETE', '完成');
  map.set('CANCELED', '取消');

  return map;
})();

export const billStatusColorMap = (() => {
  const map = new Map<BillStatus, string>();

  map.set('DRAFT', 'blue');
  map.set('WAIT_RECEIVE', 'orange');
  map.set('RECEIVING', 'purple');
  map.set('COMPLETE', 'green');
  map.set('CANCELED', 'red');

  return map;
})();
