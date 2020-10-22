import { PropType } from 'vue';

export const basicProps = {
  id: {
    type: String as PropType<string>,
    default: () => {
      return `tinymce-${new Date().getTime()}${(Math.random() * 1000).toFixed(0)}`;
    },
  },
  menubar: {
    type: String as PropType<string>,
    default: 'file edit insert view format table',
  },
  value: {
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
