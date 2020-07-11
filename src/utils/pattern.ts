import { ValidationRule } from 'ant-design-vue/types/form/form';
/**
 * 正整数
 */
export const intPattern: ValidationRule = {
  pattern: /^(0|\+?[1-9][0-9]*)$/,
  message: '只能输入数值',
};
/**
 * @description: 正数
 */
export const floatPattern: ValidationRule = {
  pattern: /^(\+)?\d+(\.\d+)?$/,
  message: '只能输入正数',
};
/**
 * @description: 自然数：（含零、正负实数）
 */
export const numberPattern: ValidationRule = {
  pattern: /^[+-]?(0|([1-9]\d*))(\.\d+)?$/,
  message: '请输入数字',
};
/**
 * @description: 数值
 */
export const numPattern: ValidationRule = {
  pattern: /(^(\+)?\d+(\.\d+)?$)|(^(100|[1-9]?\d(\.\d\d?)?)%$)/,
  message: '请输入数值',
};

/**
 * 金额
 */
export const moneyPattern: ValidationRule = {
  pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
  message: '请输入正确的金额',
};
/**
 * 手机
 */
export const mobilePattern: ValidationRule = {
  pattern: /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/,
  message: '手机号码格式错误',
  // required: true,
};

export const emailPattern: ValidationRule = {
  pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  message: '请输入正确的邮箱',
  // required: true,
};
/**
 * 手机
 */
export const idCardPattern: ValidationRule = {
  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  message: '请输入正确的证件号码',
};
export const urlPattern: ValidationRule = {
  pattern: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'*+,;=.]+$/,
  message: '请输入合法的URL地址',
};
/**
 * 字母和数字组合
 */
export const numStrPattern: ValidationRule = {
  pattern: /^[0-9a-zA-Z]*$/,
  message: '请输入字母和数字组合',
};

/**
 * 0-100，可以为小数
 */
export const percentPattern: ValidationRule = {
  pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$/,
  message: '请输入正确的百分比值',
};

/**
 * 时间区间校验
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const dateBetweenValid = (rule, value, callback) => {
  const { startTime, endTime } = value;
  if (startTime < endTime) {
    callback();
    return;
  }
  /* eslint-disable-next-line */
  callback('开始时间不能大于结束时间!');
};

/**
 * @description: 地区选择校验
 */
export const areaValidator = (level = 2) => {
  return (rule, value, callback) => {
    if (!rule.required) {
      callback();
    }
    if (!value || !Array.isArray(value) || value.length !== level + 1) {
      callback(new Error('请选择地区'));
    }
    callback();
  };
};
