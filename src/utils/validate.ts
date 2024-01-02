// 正则校验的正则表达式，这里注意正则表达式中的"\"要使用"\\"转义
const pattern = {
  account: '^\\w+$',
  phone: '^1[2-9][0-9]{9}$',
  email: '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
  pswd: '^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[\\(\\)])+$)([^(0-9a-zA-Z)]|[\\(\\)]|[a-z]|[A-Z]|[0-9]){6,}$',
  IP: '^(?=(\\b|\\D))(((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))\\.){3}((\\d{1,2})|(1\\d{1,2})|(2[0-4]\\d)|(25[0-5]))(?=(\\b|\\D))$',
  IDCard: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
  resourceCode: '^\\w+$',
  route: '^[\\w|/|:]+$',
  component: '^[\\w|/|.|:]+$',
  api: '^[\\w|/|*]+$',
};

// 对应正则表达式的提示信息
const patternMsg = {
  account: '只能由数字、字母、下划线组成',
  phone: '非正确的号码',
  email: '非正确的邮箱地址',
  pswd: '密码至少由6位包含字母、数字、特殊字符两种组合',
  IP: '非正确IP地址',
  IDCard: '非正确身份证号码',
  resourceCode: '仅支持数字大小字母下划线',
  route: '仅支持数字大小字母下划线路径分隔符以及英文冒号',
  component: '仅支持数字大小字母下划线路径分隔符英文点号以及英文冒号',
  api: '仅支持数字大小字母下划线路径分隔符以及英文星号',
};

// 根据使用的正则返回对应的正则和信息对象
export const patternValidation = (name: string, para = 'g') => {
  return {
    pattern: new RegExp(pattern[name], para),
    message: patternMsg[name],
  };
};

// 校验是否为有效的账号
export const isValidAccount = (account: string | null | undefined, para = 'g'): boolean => {
  if (!account) return false;
  return new RegExp(pattern['account'], para).test(account);
};

// 校验是否为有效的手机号
export const isValidPhone = (phone: string | null | undefined, para = 'g'): boolean => {
  if (!phone) return false;
  return new RegExp(pattern['phone'], para).test(phone);
};

// 校验是否为有效的手机号
export const isValidEmail = (email: string | null | undefined, para = 'g'): boolean => {
  if (!email) return false;
  return new RegExp(pattern['email'], para).test(email);
};

// 校验是否为有效的身份证号
export const isValidIdCard = (idCard: string | null | undefined, para = 'g'): boolean => {
  if (!idCard) return false;
  return new RegExp(pattern['IDCard'], para).test(idCard);
};

// 校验是否为有效的密码
export const isValidPassword = (pswd: string | null | undefined, para = 'g'): boolean => {
  if (!pswd) return false;
  return new RegExp(pattern['pswd'], para).test(pswd);
};
