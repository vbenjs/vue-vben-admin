import { PropOptions } from 'compatible-vue';
import { Settings } from 'tinymce';

export const basicProps = {
  id: {
    type: String,
    default: () => {
      return `tinymce-${new Date().getTime()}${(Math.random() * 1000).toFixed(0)}`;
    },
  } as PropOptions<string>,
  options: {
    type: Object,
    default: null,
  } as PropOptions<Settings>,
  menubar: {
    type: String,
    default: 'file edit insert view format table',
  } as PropOptions<string>,
  value: {
    type: String,
    // default: ''
  } as PropOptions<string>,
  // 高度
  height: {
    type: [Number, String],
    required: false,
    default: 400,
  } as PropOptions<string | number>,

  // 宽度
  width: {
    type: [Number, String],
    required: false,
    default: 'auto',
  } as PropOptions<string | number>,
  showUploadImage: {
    type: Boolean,
    default: true,
  } as PropOptions<Boolean>,
};
