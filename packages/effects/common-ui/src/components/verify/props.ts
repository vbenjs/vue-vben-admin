import type { CSSProperties, PropType } from 'vue';

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

export interface VerifyProps {
  /**
   * @description 滑块的样式
   * @default {}
   */
  actionStyle?: CSSProperties;

  /**
   * @description 滑块条的样式
   * @default {}
   */
  barStyle?: CSSProperties;

  /**
   * @description 内容的样式
   * @default {}
   */
  contentStyle?: CSSProperties;

  /**
   * @description 组件的样式
   * @default {}
   */
  wrapStyle?: CSSProperties;

  /**
   * @description 组件是否为圆角
   * @default false
   */
  circle?: boolean;

  /**
   * @description 组件宽度
   * @default 220px
   */
  width?: number | string;
  /**
   * @description 组件高度
   * @default 40px
   */
  height?: number | string;

  /**
   * @description 是否作为插槽使用，用于联动组件，可参考旋转校验组件
   * @default false
   */
  isSlot?: boolean;

  /**
   * @description 验证成功的提示
   * @default '验证通过'
   */
  successText?: string;

  /**
   * @description 提示文字
   * @default '请按住滑块拖动'
   */
  text?: string;

  /**
   * @description 是否验证成功
   * @default false
   */
  value?: boolean;
}
