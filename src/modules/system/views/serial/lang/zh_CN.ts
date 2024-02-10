/**
 * 业务编码表 国际化信息
 */
export default {
  trans: true,
  key: 'smart.tools.serial',
  data: {
    title: {
      code: '编号',
      name: '名称',
      prefix: '编码前缀',
      dateFormat: '日期格式',
      serialLength: '流水长度',
      minValue: '最小值',
      maxValue: '最大值',
      stepValue: '步长',
      currentValue: '当前值',
      currentDate: '当前日期',
      serialFormat: '格式化',
    },
    validate: {
      code: '请输入编号',
      name: '请输入名称',
      prefix: '请输入编码前缀',
      dateFormat: '请输入日期格式',
      serialLength: '请输入流水长度',
      minValue: '请输入最小值',
      maxValue: '请输入最大值，-1不限制',
      stepValue: '请输入步长',
      currentValue: '请输入当前值',
    },
    rules: {},
    search: {
      code: '请输入编号',
      name: '请输入名称',
    },
  },
};
