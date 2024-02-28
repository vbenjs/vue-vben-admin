const labelText = 'label';
export type PrintRuleType =
  | 'USER' // 用户
  | 'PDA'; // PDA

export const printRuleTypeOptions = [
  { [labelText]: '用户', value: 'USER' },
  { [labelText]: 'PDA', value: 'PDA' },
];

export const printRuleTypeMap = (() => {
  const map = new Map<PrintRuleType, string>();

  map.set('USER', '用户');
  map.set('PDA', 'PDA');

  return map;
})();
