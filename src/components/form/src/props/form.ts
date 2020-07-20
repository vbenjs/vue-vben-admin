export const formProps = {
  form: Object,
  // 当设置了改属性后,form下所有label都会使用这个宽度
  labelWidth: [String, Number],

  compact: Boolean,
  // 表单配置规则
  schemas: [Array],

  fieldMapToTime: [Array],
  size: {
    type: String,
    default: 'default',
  },
  // 校验信息是否加入label
  rulesMessageJoinLabel: Boolean,
  // 禁用表单
  disabled: Boolean,

  autoSetPlaceHolder: {
    type: Boolean,
    default: true,
  },
  // 是否显示收起展开按钮
  showAdvancedButton: { type: Boolean, default: false },
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number,
    default: 3,
  },

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  // 操作列Col配置
  actionColOptions: Object,
  // 显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  },
  // 重置按钮配置
  resetButtonOptions: Object,

  // 转化时间
  transformDateFunc: {
    type: Function,
    default: (date) => {
      return date._isAMomentObject ? date.format('YYYY-MM-DD HH:mm:ss') : date;
    },
  },
  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object,

  // 自定义重置函数
  resetFunc: Function,
  submitFunc: Function,
  // 以下为默认props
  hideRequiredMark: Boolean,

  selfUpdate: Boolean,

  labelCol: Object,

  layout: {
    type: String,
    default: 'horizontal',
  },

  wrapperCol: Object,

  colon: {
    type: Boolean,
    default: false,
  },

  labelAlign: String,
};
