import type { PropType } from 'vue';

export const basicProps = {
  actionStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },

  barStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },

  circle: {
    default: false,
    type: Boolean as PropType<boolean>,
  },
  contentStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },
  height: {
    default: 40,
    type: [Number, String] as PropType<number | string>,
  },

  isSlot: {
    default: false,
    type: Boolean as PropType<boolean>,
  },

  successText: {
    default: '验证通过',
    type: [String] as PropType<string>,
  },

  text: {
    default: '请按住滑块拖动',
    type: [String] as PropType<string>,
  },
  value: {
    default: false,
    type: Boolean as PropType<boolean>,
  },
  width: {
    default: 220,
    type: [Number, String] as PropType<number | string>,
  },
  wrapStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },
};

export const rotateProps = {
  ...basicProps,
  diffDegree: {
    default: 20,
    type: Number as PropType<number>,
  },

  imgWidth: {
    default: 260,
    type: Number as PropType<number>,
  },

  imgWrapStyle: {
    default: () => ({}),
    type: Object as PropType<any>,
  },

  maxDegree: {
    default: 270,
    type: Number as PropType<number>,
  },

  minDegree: {
    default: 90,
    type: Number as PropType<number>,
  },

  src: {
    type: String as PropType<string>,
  },
};
