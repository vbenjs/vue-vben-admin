import { PropType } from 'vue';
import { propTypes } from '/@/utils/propTypes';

export const basicProps = {
  options: {
    type: Object as PropType<any>,
    default: {},
  },
  value: propTypes.string,
  modelValue: propTypes.string,
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
  showImageUpload: propTypes.bool.def(true),
};
