import { PropOptions } from 'compatible-vue';
import { Settings } from 'tinymce';

export const basicProps = {
  id: {
    type: String,
    default: () => {
      return `tinymce-${new Date().getTime()}${(Math.random() * 1000).toFixed(0)}`;
    },
  },
  options: {
    type: Object,
    default: null,
  } as PropOptions<Settings>,
  menubar: {
    type: String,
    default: 'file edit insert view format table',
  },
  value: {
    type: String,
    // default: ''
  },
  // 高度
  height: {
    type: [Number, String],
    required: false,
    default: 400,
  },

  // 宽度
  width: {
    type: [Number, String],
    required: false,
    default: 'auto',
  },
};
