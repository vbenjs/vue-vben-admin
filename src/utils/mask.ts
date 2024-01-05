// 敏感字符串使用"*"遮罩
function maskValue(data: string, frontShow: number, afterShow: number) {
  const dataLengh = data.length;
  if (dataLengh > frontShow + afterShow) {
    let obscuringStar = '*';
    // 计算中间星星数
    for (let i = 0; i < dataLengh - frontShow - afterShow; i++) {
      obscuringStar += '*';
    }
    return (
      data.substring(0, frontShow) +
      obscuringStar +
      data.substring(data.length - afterShow, data.length)
    );
  } else {
    // 不规范时返回
    return '-';
  }
}

// 自定义遮罩
export function maskStr(str: string, frontShow: number, afterShow: number) {
  return maskValue(str, frontShow, afterShow);
}

// 手机号遮罩
export function maskPhone(str: string | undefined): string {
  return str ? maskValue(str, 3, 4) : '';
}
// 是否为遮罩手机号
export function isMaskPhone(str: string | undefined): boolean {
  return str ? str.includes('*****') : false;
}

// 身份证遮罩
export function maskIdCard(str: string | undefined): string {
  return str ? maskValue(str, 6, 4) : '';
}
// 是否为遮罩身份证
export function isMaskIdCard(str: string | undefined): boolean {
  return str ? str.includes('**********') : false;
}
