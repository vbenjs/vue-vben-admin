import { PropType } from 'vue';
import { propTypes } from '/@/utils/propTypes';
export const countToProps = {
  startVal: propTypes.number.def(0),
  endVal: propTypes.number.def(2020),
  duration: propTypes.number.def(1300),
  autoplay: propTypes.bool.def(true),
  decimals: {
    type: Number as PropType<number>,
    required: false,
    default: 0,
    validator(value: number) {
      return value >= 0;
    },
  },
  decimal: propTypes.string.def('.'),
  separator: propTypes.string.def(','),
  prefix: propTypes.string.def(''),
  suffix: propTypes.string.def(''),
  useEasing: propTypes.bool.def(true),
  easingFn: {
    type: Function as PropType<(t: number, b: number, c: number, d: number) => number>,
    default(t: number, b: number, c: number, d: number) {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b;
    },
  },
};
