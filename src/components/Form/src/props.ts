import type { FieldMapToTime, FormSchema } from './types/form';
import type { PropType } from 'vue';
import type { ColEx } from './types';
import { TableActionType } from '/@/components/Table';

export const basicProps = {
  model: {
    type: Object as PropType<any>,
    default: {},
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  compact: Boolean as PropType<boolean>,
  // 表单配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
    required: true,
  },
  mergeDynamicData: {
    type: Object as PropType<any>,
    default: null,
  },
  baseColProps: {
    type: Object as PropType<any>,
  },
  autoSetPlaceHolder: {
    type: Boolean,
    default: true,
  },
  submitOnReset: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'default' | 'small' | 'large'>,
    default: 'default',
  },
  // 禁用表单
  disabled: Boolean as PropType<boolean>,
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0,
  },
  // 是否显示收起展开按钮
  showAdvancedButton: { type: Boolean as PropType<boolean>, default: false },
  // 转化时间
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date._isAMomentObject ? date.format('YYYY-MM-DD HH:mm:ss') : date;
    },
  },
  rulesMessageJoinLabel: {
    type: Boolean,
    default: true,
  },
  // 超过3行自动折叠
  autoAdvancedLine: {
    type: Number as PropType<number>,
    default: 3,
  },

  // 是否显示操作按钮
  showActionButtonGroup: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 操作列Col配置
  actionColOptions: Object as PropType<ColEx>,
  // 显示重置按钮
  showResetButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 重置按钮配置
  resetButtonOptions: Object as PropType<any>,

  // 显示确认按钮
  showSubmitButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object as PropType<any>,

  // 自定义重置函数
  resetFunc: Function as PropType<Fn>,
  submitFunc: Function as PropType<Fn>,

  // 以下为默认props
  hideRequiredMark: Boolean as PropType<boolean>,

  labelCol: Object as PropType<ColEx>,

  layout: {
    type: String as PropType<'horizontal' | 'vertical' | 'inline'>,
    default: 'horizontal',
  },
  tableAction: {
    type: Object as PropType<TableActionType>,
  },

  wrapperCol: Object as PropType<any>,

  colon: {
    type: Boolean as PropType<boolean>,
    default: false,
  },

  labelAlign: String as PropType<string>,
};
