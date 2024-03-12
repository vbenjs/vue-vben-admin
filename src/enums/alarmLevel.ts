const labelText = 'label';

export type AlarmLevel = 'URGENT' | 'MAJOR' | 'MINOR' | 'MESSAGE';

export const alarmLevelOptions = [
  { [labelText]: '紧急', value: 'URGENT' },
  { [labelText]: '重要', value: 'MAJOR' },
  { [labelText]: '次要', value: 'MINOR' },
  { [labelText]: '提示', value: 'MESSAGE' },
];

export const alarmLevelMap = (() => {
  const map = new Map<AlarmLevel, string>();

  map.set('URGENT', '紧急');
  map.set('MAJOR', '重要');
  map.set('MINOR', '次要');
  map.set('MESSAGE', '提示');

  return map;
})();

export const alarmLevelColorMap = (() => {
  const map = new Map<AlarmLevel, string>();

  map.set('URGENT', '#F65854');
  map.set('MAJOR', '#F7A34B');
  map.set('MINOR', '#F7CE51');
  map.set('MESSAGE', '#3B8DF8');

  return map;
})();
