import { PropType } from 'vue';

export const basicProps = {
  options: {
    type: Object as PropType<any>,
    default: {},
  },
  value: {
    type: String as PropType<string>,
    // default: ''
  },
  modelValue: {
    type: String as PropType<string>,
    // default: ''
  },
  // 高度
  height: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 400,
  },

  // 宽度
  width: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 'auto',
  },
};
