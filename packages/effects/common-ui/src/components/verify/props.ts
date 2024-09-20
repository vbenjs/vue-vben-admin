import type { CSSProperties } from 'vue';

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

export interface RotateProps extends VerifyProps {
  /**
   * @description 旋转的角度
   * @default 20
   */
  diffDegree?: number;

  /**
   * @description 图片的宽度
   * @default 260
   */
  imgWidth?: number;

  /**
   * @description 图片的样式
   * @default {}
   */
  imgWrapStyle?: CSSProperties;

  /**
   * @description 最大旋转角度
   * @default 270
   */
  maxDegree?: number;

  /**
   * @description 最小旋转角度
   * @default 90
   */
  minDegree?: number;

  /**
   * @description 图片的地址
   */
  src?: string;
}

export function defaultDragVerifyProps() {
  return {
    actionStyle: () => ({}),
    barStyle: () => ({}),
    circle: false,
    contentStyle: () => ({}),
    height: '40',
    isSlot: false,
    successText: '验证通过',
    text: '请按住滑块拖动',
    value: false,
    width: '220',
    wrapStyle: () => ({}),
  };
}

export function defaultRotateVerifyProps() {
  return {
    ...defaultDragVerifyProps(),
    diffDegree: 20,
    imgWidth: 260,
    imgWrapStyle: () => ({}),
    maxDegree: 270,
    minDegree: 90,
    src: '',
  };
}
