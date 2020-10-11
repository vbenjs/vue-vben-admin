import { PropType } from 'vue';
export const countToProps = {
  startVal: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
  },
  endVal: {
    type: Number as PropType<number>,
    required: false,
    default: 2017,
  },
  duration: {
    type: Number as PropType<number>,
    required: false,
    default: 3000,
  },
  autoplay: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  decimals: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    validator(value: number) {
      return value >= 0;
    },
  },
  decimal: {
    type: String as PropType<string>,
    required: false,
    default: '.',
  },
  separator: {
    type: String as PropType<string>,
    required: false,
    default: ',',
  },
  prefix: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
  suffix: {
    type: String as PropType<string>,
    required: false,
    default: '',
  },
  useEasing: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: true,
  },
  easingFn: {
    type: Function as PropType<(t: number, b: number, c: number, d: number) => number>,
    default(t: number, b: number, c: number, d: number) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
    },
  },
};
