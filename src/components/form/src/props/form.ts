import { ColEx } from '../types/index';
import { PropOptions } from 'compatible-vue';
export const formProps = {
  form: Object as PropOptions<any>,
  // 当设置了改属性后,form下所有label都会使用这个宽度
  labelWidth: [String, Number] as PropOptions<string | number>,

  compact: Boolean as PropOptions<boolean>,
  // 表单配置规则
  schemas: [Array],

  fieldMapToTime: [Array] as PropOptions<[string, [string, string], string][]>,
  size: {
    type: String,
    default: 'default',
  } as PropOptions<string>,
  baseColProps: {
    type: Object,
  } as PropOptions<ColEx>,
  emptySpan: {
    type: [Number, Object],
    default: 0,
  } as PropOptions<number>,
  // 校验信息是否加入label
  rulesMessageJoinLabel: Boolean as PropOptions<boolean>,
  // 禁用表单
  disabled: Boolean as PropOptions<boolean>,

  autoSetPlaceHolder: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  // 是否显示收起展开按钮
  showAdvancedButton: { type: Boolean, default: false } as PropOptions<boolean>,
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number,
    default: 3,
  } as PropOptions<number>,

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  // 操作列Col配置
  actionColOptions: Object as PropOptions<ColEx>,
  // 显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  // 重置按钮配置
  resetButtonOptions: Object as PropOptions<any>,

  // 转化时间
  transformDateFunc: {
    type: Function,
    default: (date) => {
      return date._isAMomentObject ? date.format('YYYY-MM-DD HH:mm:ss') : date;
    },
  } as PropOptions<Fn>,
  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  // 确认按钮配置
  submitButtonOptions: Object as PropOptions<any>,

  // 自定义重置函数
  resetFunc: Function as PropOptions<Fn>,
  submitFunc: Function as PropOptions<Fn>,
  // 以下为默认props
  hideRequiredMark: Boolean as PropOptions<boolean>,

  selfUpdate: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  labelCol: Object as PropOptions<ColEx>,

  layout: {
    type: String,
    default: 'horizontal' as PropOptions<'horizontal' | 'vertical' | 'inline'>,
  },

  wrapperCol: Object as PropOptions<any>,

  colon: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  labelAlign: String as PropOptions<string>,
};
