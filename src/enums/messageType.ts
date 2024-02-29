const labelText = 'label';

export type MessageType = 'MSM' | 'EMAIL' | 'WX';

export const messageTypeOptions = [
  { [labelText]: '短信', value: 'MSM' },
  { [labelText]: '邮件', value: 'EMAIL' },
  { [labelText]: '微信模板消息', value: 'WX' },
];

export const messageTypeMap = (() => {
  const map = new Map<MessageType, string>();

  map.set('MSM', '短信');
  map.set('EMAIL', '邮件');
  map.set('WX', '微信模板消息');

  return map;
})();
