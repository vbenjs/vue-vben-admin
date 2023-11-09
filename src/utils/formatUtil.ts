export function formatMoney(money: number | string): string {
  money = money ? String(money) : '';
  return String(money).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
// 格式函数扩展，数字转换中文大写
export function amountToChinese(n) {
  let sign = '';
  if (!/^-?(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '';
  if (parseFloat(n) < 0) {
    sign = '欠';
    n = n.substring(1); // 去掉"-"符号
  }
  let unit = '千百拾亿千百拾万千百拾元角分',
    str = '';
  n += '00';
  const p = n.indexOf('.');
  if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++)
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return (
    sign +
    str
      .replace(/零(千|百|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整')
  );
}
