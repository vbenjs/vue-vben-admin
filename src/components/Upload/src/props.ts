import type { PropType } from 'vue';

export const basicProps = {
  helpText: {
    type: String as PropType<string>,
    default: '',
  },
  // 文件最大多少MB
  maxSize: {
    type: Number as PropType<number>,
    default: 2,
  },
  // 最大数量的文件，0不限制
  maxNumber: {
    type: Number as PropType<number>,
    default: 0,
  },
  // 根据后缀，或者其他
  accept: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: true,
  },
};

export const uploadContainerProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  ...basicProps,
};

export const priviewProps = {
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
};
