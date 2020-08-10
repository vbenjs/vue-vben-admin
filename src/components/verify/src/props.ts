import { PropOptions } from 'compatible-vue';

export const basicProps = {
  value: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  isSlot: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  text: {
    type: [String],
    default: '请按住滑块拖动',
  } as PropOptions<string>,
  successText: {
    type: [String],
    default: '验证通过',
  } as PropOptions<string>,
  height: {
    type: [Number, String],
    default: 40,
  } as PropOptions<number | string>,

  width: {
    type: [Number, String],
    default: 260,
  } as PropOptions<number | string>,

  circle: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  wrapStyle: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  contentStyle: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  barStyle: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  actionStyle: {
    type: Object,
    default: null,
  } as PropOptions<any>,
};

export const rotateProps = {
  ...basicProps,
  src: {
    type: String,
  } as PropOptions<string>,

  imgWidth: {
    type: Number,
    default: 260,
  } as PropOptions<number>,

  imgWrapStyle: {
    type: Object,
    default: null,
  } as PropOptions<any>,

  minDegree: {
    type: Number,
    default: 90,
  } as PropOptions<number>,

  maxDegree: {
    type: Number,
    default: 210,
  } as PropOptions<number>,

  diffDegree: {
    type: Number,
    default: 20,
  } as PropOptions<number>,
};
