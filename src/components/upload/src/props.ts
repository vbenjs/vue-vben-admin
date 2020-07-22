import { PropOptions } from 'compatible-vue';

export const basicProps = {
  helpText: {
    type: String,
    default: '支持jpg、jpeg、png格式，单次可最多选择10张图片，每张不可大于2M。',
  } as PropOptions<string>,
  // 文件最大多少MB
  maxSize: {
    type: Number,
    default: 2,
  } as PropOptions<number>,
  maxNumber: {
    type: Number,
    default: 10,
  } as PropOptions<number>,
  accept: {
    type: Array,
    default: () => {
      return ['jpg', 'jpeg', 'png'];
    },
  } as PropOptions<string[]>,
};
